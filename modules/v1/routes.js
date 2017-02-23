const router = require('express').Router()

router.get('/test', (req, res) => {
  res.json({message: 'v1 working!'})
})

/**
 * Use the modules routes. It's safer doing in a separate file than magically, to
 * be sure nester routes will be applied correctly.
 */
router.use('/users', require('./user/routes'))
router.use('/auth', require('./auth/routes'))
router.use('/page-content', require('./pageContent/routes'))
router.use('/news', require('./news/routes'))
router.use('/events', require('./event/routes'))
router.use('/districts', require('./district/routes'))

// Return router
module.exports = router
