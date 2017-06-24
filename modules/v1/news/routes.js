const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// File Upload Handling
const multer = require('multer')
const upload = multer({ dest: 'public/news' })

// Create
router.post('/', [jwtMiddleware, validators.create, validators.uniqueSlugValidator], controller.create)

// Get
router.get('/', [], controller.find)

// Get by Id
router.get('/:id', [], controller.findByIdOrSlug)

// Update Views
router.patch('/:id/views', [validators.updateViews], controller.updateViews)

// Update
router.patch('/:id', [jwtMiddleware, validators.update, validators.uniqueSlugValidator], upload.single('image'), controller.update)

// Delete
router.delete('/:id', [jwtMiddleware], controller.remove)

// Rescrape the URL on Facebook End
router.patch('/:id/rescrape', [jwtMiddleware], controller.rescrape)

module.exports = router
