const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')

// Create
router.post('/', validators.create, controller.create)

// Get
router.get('/', controller.find)

// Get by Id
router.get('/:id', controller.findById)

// Update
router.patch('/:id', validators.update, controller.findOneAndUpdate)

// Delete
router.delete('/:id', controller.remove)

module.exports = router
