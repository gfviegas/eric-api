const router = require('express').Router()

const rfr = require('rfr')
const mailer = rfr('helpers/mailer')

router.post('/test', (req, res) => {
  const options = {
    to: 'webviegas@gmail.com',
    subject: 'Teste',
    template: {
      path: 'auth/reset-password',
      data: {}
    }
  }
  const returned = mailer.sendMail(options)
  res.json({message: returned})
})

/**
 * Use the modules routes. It's safer doing in a separate file than magically, to
 * be sure nester routes will be applied correctly.
 */
router.use('/auth', require('./auth/routes'))
router.use('/contact', require('./contact/routes'))
router.use('/documents', require('./document/routes'))
router.use('/districts', require('./district/routes'))
router.use('/events', require('./event/routes'))
router.use('/news', require('./news/routes'))
router.use('/page-content', require('./pageContent/routes'))
router.use('/rewards', require('./reward/routes'))
router.use('/users', require('./user/routes'))

// Return router
module.exports = router
