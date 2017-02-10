const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// Create
router.post('/', [jwtMiddleware, validators.create], controller.create)

// Get
router.get('/', [jwtMiddleware], controller.find)

// Check if exists
router.post('/email', [validators.email], controller.checkExists)

// Get by Id
router.get('/:id', [], controller.findById)

// Update
router.patch('/:id', [jwtMiddleware, validators.update], controller.findOneAndUpdate)

// Delete
router.delete('/:id', [jwtMiddleware], controller.remove)

module.exports = router
