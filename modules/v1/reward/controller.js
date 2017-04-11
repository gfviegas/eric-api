const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const mailer = rfr('helpers/mailer')

const controllerActions = {}

// Import default actions
const importActions = ['find', 'findById', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

const badgeMail = 'gustavo83geosc@gmail.com'
const rewardMail = 'gustavo83geosc@gmail.com'
const sowerMail = 'gustavo83geosc@gmail.com'
// const badgeMail = 'rodrigo.martins@escoteirosmg.org.br, gustavo83geosc@gmail.com'
// const rewardMail = 'condecoracoes@escoteirosmg.org.br, gustavo83geosc@gmail.com'
// const sowerMail = 'condecoracoes@escoteirosmg.org.br, gustavo83geosc@gmail.com'

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
            path: 'badge/new',
            data: modelInstance.toObject()
          }
        }
      } else if (modelInstance.type === 'reward') {
        options = {
          to: rewardMail,
          subject: 'Nova Solicitação de Condecoração/Recompensa',
          template: {
            path: 'reward/new',
            data: modelInstance.toObject()
          }
        }
      } else if (modelInstance.type === 'sower') {
        options = {
          to: sowerMail,
          subject: 'Nova Solicitação de Distintivo de Semeador',
          template: {
            path: 'sower/new',
            data: modelInstance.toObject()
          }
        }
      }

      if (options !== {}) mailer.sendMail(options)
    })
  },
  findOneAndUpdate: (req, res) => {
    const query = {_id: req.params.id}
    const mod = req.body
    Model.findOneAndUpdate(query, {$set: mod}, {new: true}, (err, data) => {
      if (err) throw err

      res.status(200).json(data)

      let options = {}
      if (data.type === 'badge') {
        options = {
          to: data.author.email,
          subject: 'Atualização de Solicitação de Distintivo Especial 👌 👀',
          template: {
            path: 'badge/update',
            data: data.toObject()
          }
        }
      } else if (data.type === 'reward') {
        options = {
          to: data.author.email,
          subject: 'Atualização de Solicitação de Condecoração/Recompensa 👌 👀',
          template: {
            path: 'reward/update',
            data: data.toObject()
          }
        }
      } else if (data.type === 'sower') {
        options = {
          to: data.author.email,
          subject: 'Atualização de Solicitação de Distintivo de Semeador 👌 👀',
          template: {
            path: 'sower/update',
            data: data.toObject()
          }
        }
      }

      if (options !== {}) mailer.sendMail(options)
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
