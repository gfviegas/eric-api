const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// Create
router.post('/', [jwtMiddleware, validators.create, validators.uniqueSlugValidator], controller.create)

// Get
router.get('/', [], controller.find)

// Get by Id
router.get('/:id', [], controller.findByIdOrSlug)

// Update
router.patch('/:id', [jwtMiddleware, validators.update, validators.uniqueSlugValidator], controller.update)

// Delete
router.delete('/:id', [jwtMiddleware], controller.remove)

module.exports = router
