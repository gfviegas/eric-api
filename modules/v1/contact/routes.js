const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// Create
router.post('/', [validators.create], controller.create)

// Get
router.get('/', [], controller.find)

// Get by Id
router.get('/:id', [validators.find], controller.findById)

module.exports = router
