const pug = require('pug')
const emailData = require('../config/template').email
const email = require('emailjs/email')

const server = email.server.connect({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  ssl: true
})

const sendMail = (options) => {
  const data = Object.assign({_email: emailData}, options.template.data)
  const mailPath = `${process.cwd()}/templates/mails/${options.template.path}.pug`
  const htmlstream = pug.renderFile(mailPath, data)
  const message = {
    from: 'Escoteiros de Minas Gerais ⚜️ 🔺 <contato@escoteirosmg.org.br>',
    to: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? 'gustavo83geosc@gmail.com' : (options.to),
    bcc: 'sistema@escoteirosmg.org.br',
    subject: options.subject,
    attachment:
    [
      {data: htmlstream, alternative: true}
    ]
  }

  server.send(message, (error, info) => {
    if (error) {
      console.log(JSON.stringify(error))
      return {success: false, error: error}
    }
    return {success: true, info: info}
  })
}

module.exports = {
  sendMail
}
