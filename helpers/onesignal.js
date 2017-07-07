const request = require('request-promise')

const sendNotification = (options) => {
  const segment = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ? ['Developers'] : ['All']

  const requestOptions = {
    method: 'POST',
    uri: 'https://onesignal.com/api/v1/notifications',
    body: {
      app_id: `${process.env.ONE_SIGNAL_APP_ID}`,
      included_segments: segment,
      chrome_web_icon: 'https://www.escoteirosmg.org.br/static/icon2.png',
      chrome_web_image: options.image,
      url: options.url,
      headings: {
        en: options.title
      },
      contents: {
        en: options.message
      }
    },
    headers: {
      Authorization: `Basic ${process.env.ONE_SIGNAL_TOKEN}`
    },
    json: true
  }
  return request(requestOptions)
}

module.exports = {
  sendNotification: sendNotification
}
