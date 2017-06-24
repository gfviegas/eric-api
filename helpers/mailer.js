// const nodemailer = require('nodemailer')
const pug = require('pug')
const emailData = require('../config/template').email
const email = require('emailjs/email')

// const transporter = nodemailer.createTransport({
//   secure: true,
//   tls: {
//     rejectUnauthorized: false
//   },
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD
//   }
// })
//
// const sendMail = (options) => {
//   const data = Object.assign({email: emailData}, options.template.data)
//   const mailPath = `${process.cwd()}/templates/mails/${options.template.path}.pug`
//   const htmlstream = pug.renderFile(mailPath, data)
//   const mailOptions = {
//     from: '"Escoteiros de Minas Gerais ⚜️ 🔺" <contato@escoteirosmg.org.br>',
//     to: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? 'gustavo83geosc@gmail.com' : (options.to),
//     bcc: 'gustavo.viegas@escotismo.org',
//     subject: options.subject,
//     html: htmlstream
//   }
//
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return {success: false, error: error}
//     }
//     return {success: true, info: info}
//   })
// }

const server = email.server.connect({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  host: 'br718.hostgator.com.br',
  port: process.env.MAIL_PORT,
  ssl: true
})

const sendMail = (options) => {
  const data = Object.assign({email: emailData}, options.template.data)
  const mailPath = `${process.cwd()}/templates/mails/${options.template.path}.pug`
  const htmlstream = pug.renderFile(mailPath, data)
  const message = {
    from: 'Escoteiros de Minas Gerais ⚜️ 🔺 <contato@escoteirosmg.org.br>',
    to: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? 'gustavo83geosc@gmail.com' : (options.to),
    bcc: 'gustavo.viegas@escotismo.org',
    subject: options.subject,
    attachment:
    [
      {data: htmlstream, alternative: true}
    ]
  }

  // send the message and get a callback with an error or details of the message that was sent
  server.send(message, (error, info) => {
    console.log(error || message)
    if (error) {
      return {success: false, error: error}
    }
    return {success: true, info: info}
  })
}

module.exports = {
  sendMail
}
