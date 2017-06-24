const rfr = require('rfr')
const actionsPath = './actions/'
const model = require('../user/model').model
const extend = require('extend')
const jwt = require('jsonwebtoken')
const mailer = rfr('helpers/mailer')

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
  },
  resetPassword: (req, res) => {
    const query = { email: req.body.email }
    model.findOne(query)
    .exec((err, user) => {
      if (err) throw err

      if (!user) {
        res.status(404).json({error: 'user_not_found'})
      } else {
        user['passwordToken'] = Math.random().toString(35).substr(2, 20).toUpperCase()

        user.save((error) => {
          if (error) throw error

          const options = {
            to: user['email'],
            subject: 'Alteração de Senha',
            template: {
              path: 'auth/reset-password',
              data: user.toObject()
            }
          }

          console.log(JSON.stringify(options))
          mailer.sendMail(options)

          res.status(200).json({success: true})
        })
      }
    })
  },
  findByPasswordToken: (req, res) => {
    const query = {passwordToken: req.params.token}
    model.findOne(query, (err, data) => {
      if (err) throw err

      if (!data) {
        res.status(404).json({error: 'user_not_found'})
      } else {
        res.status(200).json(data)
      }
    })
  },
  updatePassword: (req, res) => {
    const query = {passwordToken: req.params.token}
    model.findOne(query, (err, user) => {
      if (err) throw err

      if (!user) {
        res.status(404).json({error: 'user_not_found'})
      } else {
        user['passwordToken'] = undefined
        user['password'] = req.body.password
        user.save((error) => {
          if (error) throw error

          res.status(204).json({})
        })
      }
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
