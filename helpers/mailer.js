const nodemailer = require('nodemailer')
const pug = require('pug')
const emailData = require('../config/template').email

const transporter = nodemailer.createTransport({
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

const sendMail = (options) => {
  const data = Object.assign({email: emailData}, options.template.data)
  const mailPath = `${process.cwd()}/templates/mails/${options.template.path}.pug`
  const htmlstream = pug.renderFile(mailPath, data)
  const mailOptions = {
    from: '"Escoteiros de Minas Gerais ⚜️ 🔺" <contato@escoteirosmg.org.br>',
    to: options.to,
    cc: 'gustavo.viegas@escotismo.org',
    subject: options.subject,
    html: htmlstream
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return {success: false, error: error}
    }
    return {success: true, info: info}
  })
}

module.exports = {
  sendMail
}
