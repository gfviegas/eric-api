const mailer = require('./mailer')

const sendErrorMail = (data) => {
  const options = {
    to: 'gustavo.viegas@escotismo.org',
    subject: '⚠️ Erro em ERIC-API ⚠️',
    template: {
      path: 'error/index',
      data: data
    }
  }
  mailer.sendMail(options)
}

module.exports = {
  sendMail: sendErrorMail
}
