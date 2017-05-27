const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')

const typeValidators = (req, required) => {
  if (required) {
    req.checkBody('type', {error: 'required'}).notEmpty()
  }
  req.checkBody('type', {error: 'invalid'}).isIn(['question', 'compliment', 'complaint', 'suggestion', 'other'])
}

const targetValidators = (req, required) => {
  if (required) {
    req.checkBody('target', {error: 'required'}).notEmpty()
  }
  req.checkBody('target', {error: 'invalid'}).isIn(['communication', 'reward', 'growth', 'office', 'financial', 'adults', 'institutional', 'youngs', 'legal', 'ombudsman', 'educative'])
}

const authorValidators = (req, required) => {
  if (required) {
    req.checkBody('author.group.number', {error: 'required'}).notEmpty()
    req.checkBody('author.group.name', {error: 'required'}).notEmpty()
    req.checkBody('author.email', {error: 'required'}).notEmpty()
    req.checkBody('author.name', {error: 'required'}).notEmpty()
  }
  req.checkBody('author.email', {error: 'invalid'}).isEmail()
}

module.exports = {
  find: (req, res, next) => {
    req.checkParams('id', {error: 'invalid'}).isMongoId()
    handleValidation(req, res, next)
  },
  create: (req, res, next) => {
    typeValidators(req, true)
    targetValidators(req, true)
    authorValidators(req, true)
    handleValidation(req, res, next)
  },
  replace: (req, res, next) => {
    typeValidators(req, true)
    targetValidators(req, true)
    authorValidators(req, true)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    handleValidation(req, res, next)
  }
}
