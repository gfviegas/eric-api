const rfr = require('rfr')
const actionsPath = './actions/'
const model = require('../user/model').model
const extend = require('extend')
const jwt = require('jsonwebtoken')

const controllerActions = {}

// Import default actions
const importActions = []
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  generateToken: (user) => {
    const payload = {
      sub: user.id,
      data: {
        roles: user.roles,
        name: user.name
      }
    }
    const options = {
      expiresIn: '365d',
      issuer: 'SREMG-API'
    }

    return jwt.sign(payload, process.env.APP_SECRET, options)
  },
  authenticate: (req, res) => {
    model.findOne({ email: req.body.email })
    .select('+password')
    .exec((err, user) => {
      if (err) throw err

      if (!user) {
        res.status(404).json({error: 'user_not_found'})
      } else {
        user.verifyPassword(req.body.password, (err, valid) => {
          if (err) throw err

          if (!valid) {
            res.status(422).json({error: 'wrong_credentials'})
          } else {
            res.status(200).json({token: customMethods.generateToken(user)})
          }
        })
      }
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
