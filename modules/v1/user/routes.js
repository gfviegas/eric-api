const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// Create
router.post('/', [jwtMiddleware, validators.create], controller.create)

// Get
router.get('/', [jwtMiddleware], controller.find)

// Get by Id
router.get('/:id', [], controller.findById)

// Replace
router.put('/:id', [jwtMiddleware, validators.replace], controller.findOneAndUpdate)

// Update
router.patch('/:id', [jwtMiddleware, validators.update], controller.findOneAndUpdate)

// Delete
router.delete('/:id', [jwtMiddleware], controller.remove)

module.exports = router
