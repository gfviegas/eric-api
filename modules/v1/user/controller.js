const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')

const controllerActions = {}

// Import default actions
const importActions = ['create', 'find', 'findById', 'findOneAndUpdate', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  checkExists: (req, res) => {
    Model
      .count(req.body)
      .exec((err, value) => {
        if (err) throw err
        res.status(200).json({exists: !!(value >= 1)})
      })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
