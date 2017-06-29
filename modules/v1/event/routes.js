const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// File Upload Handling
const multer = require('multer')
const upload = multer({ dest: 'public/news' })

// Create
router.post('/', [jwtMiddleware, validators.create, validators.uniqueSlugValidator], upload.single('image'), controller.create)

// Get
router.get('/', [], controller.find)

// Get by Id
router.get('/:id', [], controller.findByIdOrSlug)

// Update
router.patch('/:id', [jwtMiddleware, validators.update, validators.uniqueSlugValidator], upload.single('image'), controller.update)

// Delete
router.delete('/:id', [jwtMiddleware], controller.remove)

module.exports = router
