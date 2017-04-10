const rfr = require('rfr')
const router = require('express').Router()
const controller = require('./controller')
const validators = require('./validators')
const jwtMiddleware = rfr('/helpers/jwt').middleware

// File Upload Handling
const multer = require('multer')
const upload = multer({ dest: 'public/documents' })

// Create
router.post('/', [jwtMiddleware, validators.create], upload.single('file'), controller.create)

// Get
router.get('/', [], controller.find)

// Get by Id
router.get('/:id', [], controller.findById)

// Replace
router.put('/:id', [jwtMiddleware, validators.replace], upload.single('file'), controller.update)

// Delete
router.delete('/:id', [jwtMiddleware], controller.remove)

module.exports = router
