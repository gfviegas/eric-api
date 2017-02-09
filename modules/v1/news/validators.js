const rfr = require('rfr')
const handleValidation = rfr('/helpers/validation')

const titleValidators = (req) => {
  req.checkBody('title', {error: 'required'}).notEmpty()
  req.checkBody('title', {error: 'length', min: 4, max: 100}).len(4, 100)
}
const contentValidators = (req) => {
  req.checkBody('content', {error: 'required'}).notEmpty()
}
const newsValidator = (req) => {
  titleValidators(req)
  contentValidators(req)
}

module.exports = {
  create: (req, res, next) => {
    newsValidator(req)
    handleValidation(req, res, next)
  },
  update: (req, res, next) => {
    req.checkBody('title', {error: 'length', min: 4, max: 100}).len(4, 100)
    next()
  }
}
