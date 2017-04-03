const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')

const typeValidators = (req, required) => {
  if (required) {
    req.checkBody('type', {error: 'required'}).notEmpty()
  }
  req.checkBody('type', {error: 'invalid'}).isIn(['badge', 'reward', 'sower'])
}

const statusValidators = (req) => {
  req.checkBody('status', {error: 'invalid'}).isIn(['waiting', 'analyzing', 'issued', 'rejected', 'approved'])
}

const authorValidators = (req, required) => {
  if (required) {
    req.checkBody('author.register', {error: 'required'}).notEmpty()
    req.checkBody('author.group.number', {error: 'required'}).notEmpty()
    req.checkBody('author.email', {error: 'required'}).notEmpty()
    req.checkBody('author.group.name', {error: 'required'}).notEmpty()
  }
  req.checkBody('author.email', {error: 'invalid'}).isEmail()
}

const giftedValidators = (req, required) => {
  if (required) {
    req.checkBody('gifted.name', {error: 'required'}).notEmpty()
    req.checkBody('gifted.register', {error: 'required'}).notEmpty()
    req.checkBody('gifted.group.number', {error: 'required'}).notEmpty()
    req.checkBody('gifted.group.name', {error: 'required'}).notEmpty()
  }
}

module.exports = {
  find: (req, res, next) => {
    req.checkParams('id', {error: 'invalid'}).isMongoId()
    handleValidation(req, res, next)
  },
  create: (req, res, next) => {
    typeValidators(req, true)
    authorValidators(req, true)
    giftedValidators(req, true)
    handleValidation(req, res, next)
  },
  replace: (req, res, next) => {
    typeValidators(req, true)
    statusValidators(req)
    authorValidators(req, true)
    giftedValidators(req, true)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    // typeValidators(req, false)
    statusValidators(req)
    // resumeValidators(req)
    // authorValidators(req, false)
    // giftedValidators(req, false)
    handleValidation(req, res, next)
  }
}
