const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const mailer = rfr('helpers/mailer')

const controllerActions = {}

// Import default actions
const importActions = ['find', 'findById', 'findOneAndUpdate', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

const badgeMail = 'rodrigo.martins@escoteirosmg.org.br'
const rewardMail = 'condecoracoes@escoteirosmg.org.br'

// Controller custom actions
const customMethods = {
  create: (req, res) => {
    const data = req.body
    const modelInstance = new Model(data)

    modelInstance.save((err, data) => {
      if (err) throw err

      res.status(201).json(modelInstance)

      let options = {}
      if (modelInstance.type === 'badge') {
        options = {
          to: badgeMail,
          subject: 'Nova Solicitação de Distintivo Especial',
          template: {
            path: 'badges/new',
            data: modelInstance
          }
        }
      } else if (modelInstance.type === 'reward') {
        options = {
          to: rewardMail,
          subject: 'Nova Solicitação de Condecoração/Recompensa',
          template: {
            path: 'reward/new',
            data: modelInstance
          }
        }
      }

      if (options !== {}) mailer.sendMail(options)
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
