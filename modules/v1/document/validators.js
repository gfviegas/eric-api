const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')

const typeValidators = (req, required) => {
  if (required) {
    req.checkBody('type', {error: 'required'}).notEmpty()
  }
  req.checkBody('type', {error: 'invalid'}).isIn(['book', 'notice', 'resolution', 'ordinance', 'balance', 'minute', 'other'])
}

const titleValidators = (req) => {
  req.checkBody('title', {error: 'required'}).notEmpty()
}

const fileValidators = (req) => {
  req.checkBody('file', {error: 'required'}).notEmpty()
}

module.exports = {
  find: (req, res, next) => {
    req.checkParams('id', {error: 'invalid'}).isMongoId()
    handleValidation(req, res, next)
  },
  create: (req, res, next) => {
    typeValidators(req, true)
    titleValidators(req)
    handleValidation(req, res, next)
  },
  replace: (req, res, next) => {
    typeValidators(req, true)
    titleValidators(req)
    fileValidators(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    typeValidators(req, false)
    titleValidators(req)
    handleValidation(req, res, next)
  }
}
