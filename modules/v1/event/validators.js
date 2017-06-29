const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')
const Model = require('./model').model

const uniqueSlugValidator = (req, res, next) => {
  Model
    .findOne({slug: req.body.slug})
    .exec((err, value) => {
      if (err) throw err

      if (!value) {
        next()
      } else {
        if (req.params.id && value._id.equals(req.params.id)) {
          next()
        } else {
          const errorMessage = {
            'slug': {
              param: 'slug',
              msg: {
                error: 'unique'
              }
            }
          }
          res.status(409).json(errorMessage)
          return false
        }
      }
    })
}

const titleValidators = (req) => {
  req.checkBody('title', {error: 'required'}).notEmpty()
  req.checkBody('title', {error: 'length', min: 4, max: 100}).len(4, 100)
}
const descriptionValidators = (req) => {
  req.checkBody('description', {error: 'required'}).notEmpty()
}
const slugValidators = (req) => {
  req.checkBody('slug', {error: 'required'}).notEmpty()
  req.checkBody('slug', {error: 'length', min: 4, max: 100}).len(4, 100)
}
const newsValidator = (req) => {
  titleValidators(req)
  descriptionValidators(req)
  slugValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    newsValidator(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    req.checkBody('title', {error: 'length', min: 4, max: 100}).len(4, 100)
    req.checkBody('slug', {error: 'length', min: 4, max: 100}).len(4, 100)
    next()
  },
  uniqueSlugValidator
}
