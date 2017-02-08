const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')

// Create JWT
router.post('/', validators.create, controller.authenticate)

module.exports = router
