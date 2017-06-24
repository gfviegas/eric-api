const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')

// Create JWT
router.post('/', validators.create, controller.authenticate)

// Set password reset token and send reset password email
router.post('/reset', validators.reset, controller.resetPassword)

// Get by Passwork Token
router.get('/passwordtoken/:token', [], controller.findByPasswordToken)

router.patch('/:token/password', validators.updatePassword, controller.updatePassword)

module.exports = router
