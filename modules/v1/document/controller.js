const fs = require('fs')
const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const jwtHelper = rfr('helpers/jwt')

const controllerActions = {}

// Import default actions
const importActions = ['find', 'findById', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

const findOneAndUpdate = (query, mod, res) => {
  Model.findOneAndUpdate(query, {$set: mod}, {new: true}, (err, data) => {
    if (err) throw err

    res.status(200).json(data)
  })
}

// Controller custom actions
const customMethods = {
  create: (req, res) => {
    const data = req.body
    data['last_updated_by'] = jwtHelper.getUserId(req)
    const modelInstance = new Model(data)

    const file = req.file
    const path = file.path
    const modelPath = `files/${data.type}/${data._id}`
    const localPath = `${process.cwd()}/public/${modelPath}`
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath)
    }

    const newFile = localPath + '/' + file.name
    fs.rename(path, newFile, (err) => {
      if (err) {
        res.status(500).json({error: err})
      }

      modelInstance['file'] = `${modelPath}/${file.name}`
      modelInstance.save((err, data) => {
        if (err) throw err

        res.status(201).json(modelInstance)
      })
    })
  },
  update: (req, res) => {
    const query = {_id: req.params.id}
    const mod = req.body
    const file = req.file

    if (file) {
      Model
        .find(query)
        .exec((err, data) => {
          if (err) throw err

          const path = file.path
          const modelPath = `files/${data.type}/${data._id}`
          const localPath = `${process.cwd()}/public/${modelPath}`
          if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath)
          }

          const newFile = localPath + '/' + file.name
          fs.rename(path, newFile, (err) => {
            if (err) {
              res.status(500).json({error: err})
            }

            data['file'] = `${modelPath}/${file.name}`
            data.save((err, data) => {
              if (err) throw err

              res.status(200).json(data)
            })
          })
        })
    } else {
      findOneAndUpdate(query, mod, res)
    }
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
