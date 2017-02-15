const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')
const Model = require('./model').model

const uniqueEmailValidator = (req, res, next) => {
  Model
    .findOne({email: req.body.email})
    .exec((err, value) => {
      if (err) throw err

      if (!value) {
        next()
      } else {
        if (req.params.id && value._id.equals(req.params.id)) {
          next()
        } else {
          const errorMessage = {
            'email': {
              param: 'email',
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

const nameValidators = (req) => {
  req.checkBody('name', {error: 'required'}).notEmpty()
  req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
}
const emailValidators = (req) => {
  req.checkBody('email', {error: 'required'}).notEmpty()
  req.checkBody('email', {error: 'invalid'}).isEmail()
}
const passwordValidators = (req) => {
  req.checkBody('password', {error: 'required'}).notEmpty()
  req.checkBody('password', {error: 'length', min: 6, max: 20}).len(6, 20)
}
const userValidator = (req) => {
  nameValidators(req)
  passwordValidators(req)
  emailValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    userValidator(req)
    handleValidation(req, res, next)
  },
  replace: (req, res, next) => {
    userValidator(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    req.checkBody('name', {error: 'length', min: 4, max: 20}).len(4, 20)
    req.checkBody('email', {error: 'invalid'}).isEmail()
    handleValidation(req, res, next)
  },
  email (req, res, next) {
    emailValidators(req)
    handleValidation(req, res, next)
  },
  uniqueEmailValidator
}
