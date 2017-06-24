const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')

const emailValidators = (req) => {
  req.checkBody('email', {error: 'required'}).notEmpty()
  req.checkBody('email', {error: 'invalid'}).isEmail()
}
const passwordValidators = (req) => {
  req.checkBody('password', {error: 'required'}).notEmpty()
}
const authValidator = (req) => {
  passwordValidators(req)
  emailValidators(req)
}
const resetValidator = (req) => {
  emailValidators(req)
}
const updateValidator = (req) => {
  passwordValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    authValidator(req)
    handleValidation(req, res, next)
  },
  reset: (req, res, next) => {
    resetValidator(req)
    handleValidation(req, res, next)
  },
  updatePassword: (req, res, next) => {
    updateValidator(req)
    handleValidation(req, res, next)
  }
}
