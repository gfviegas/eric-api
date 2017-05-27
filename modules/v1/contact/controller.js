const rfr = require('rfr')
const actionsPath = './actions/'
const modelRequired = require('./model')
const Model = modelRequired.model
const emails = modelRequired.emails
const extend = require('extend')
const mailer = rfr('helpers/mailer')

const controllerActions = {}

// Import default actions
const importActions = ['find', 'findById', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)
// Controller custom actions
const customMethods = {
  create: (req, res) => {
    const data = req.body
    const modelInstance = new Model(data)

    modelInstance.save((err, data) => {
      if (err) throw err

      res.status(201).json(modelInstance)

      const contactType = modelRequired.getContactType(modelInstance.type)
      const contactTarget = modelRequired.getContactTarget(modelInstance.target)

      const options = {
        to: emails[modelInstance.target],
        subject: `Nova Mensagem no Site dos Escoteiros de Minas - ${contactType}`,
        template: {
          path: 'contact/new',
          data: extend(modelInstance.toObject(), {contactType, contactTarget})
        }
      }

      console.log(options)
      console.log(mailer.sendMail(options))
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
