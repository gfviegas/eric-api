const email = {
  base_url: process.env.SITE_URL,
  admin_url: process.env.ADMIN_URL,
  base_name: 'Escoteiros de Minas Gerais',
  address: 'Rua Mariano Procópio, 90 - Mariano Procópio, Juiz de Fora - Minas Gerais',
  phone: '(32) 3215-7674',
  logo: `${process.env.ASSETS_URL}img/logo.png`,
  imgPath: `${process.env.ASSETS_URL}img/`
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
