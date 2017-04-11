const email = {
  base_url: process.env.SITE_URL,
  admin_url: process.env.ADMIN_URL,
  base_name: 'Escoteiros de Minas Gerais',
  address: 'Rua Mariano Procópio, 90 - Mariano Procópio, Juiz de Fora - Minas Gerais',
  phone: '(32) 3215-7674',
  logo: `${process.env.ASSETS_URL}img/logo.png`,
  imgPath: `${process.env.ASSETS_URL}img/`,
  rewardStatus: (status) => {
    if (!status) return ''
    switch (status) {
      case 'waiting':
        return 'Aguardando - A solicitação foi recebida e está aguardando análise.'
      case 'analyzing':
        return 'Analisando - A Região Escoteira está analisando a sua solicitação.'
      case 'issued':
        return 'Emitido - A solicitação foi aprovada e a sua recompensa já foi emitida.'
      case 'rejected':
        return 'Indeferido - A solicitação foi negada.'
      case 'approved':
        return 'Deferido - A solicitação foi aprovada e aguarda emissão.'
    }
  }
}

const configure = (app) => {
  app.set('view engine', 'pug')
  app.set('views', './templates')

  app.locals.email = email
}

module.exports = {
  email: email,
  configure: configure
}
