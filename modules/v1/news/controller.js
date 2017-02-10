const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const jwtHelper = rfr('helpers/jwt')

const controllerActions = {}

// Import default actions
const importActions = ['findById', 'findOneAndUpdate', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  find: (req, res) => {
    const query = {}
    Model
      .find(query)
      .sort({'created_at': -1})
      .populate('last_updated_by')
      .exec((err, data) => {
        if (err) throw err
        res.status(200).json(data)
      })
  },
  create: (req, res) => {
    const data = req.body
    data['last_updated_by'] = jwtHelper.getUserId(req)
    const modelInstance = new Model(data)

    modelInstance.save((err, data) => {
      if (err) throw err
      data
        .populate('last_updated_by', (err, news) => {
          if (err) throw err
          res.status(201).json(news)
        })
    })
  },
  test: (req, res) => {
    res.status(200).json({tested: true})
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
