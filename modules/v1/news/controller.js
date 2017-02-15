const fs = require('fs')
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

const findOneAndUpdate = (query, mod, res) => {
  Model.findOneAndUpdate(query, {$set: mod}, {new: true}, (err, data) => {
    if (err) throw err

    res.status(200).json(data)
  })
}

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
  update: (req, res) => {
    const query = {_id: req.params.id}
    const mod = req.body
    const file = req.file
    console.log(req.file)
    if (file) {
      const path = file.path
      const modelPath = `news/${req.params.id}`
      const localPath = `${process.cwd()}/public/${modelPath}`
      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath)
      }

      let fileName = ''
      if (file.mimetype === 'image/jpeg' || 'image/jpg') {
        fileName = `${file.filename}.jpg`
      } else if (file.mimetype === 'image/png') {
        fileName = `${file.filename}.png`
      } else {
        return res.status(422).json({format: 'invalid_format'})
      }

      const newFile = localPath + '/' + fileName
      fs.rename(path, newFile, (err) => {
        if (err) {
          res.status(500).json({error: err})
        }

        mod['image'] = `${modelPath}/${fileName}`

        findOneAndUpdate(query, mod, res)
      })
    } else {
      findOneAndUpdate(query, mod, res)
    }
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
