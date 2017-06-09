const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const jwtHelper = rfr('helpers/jwt')
const createQueryObject = rfr('helpers/request').createQueryObject

const controllerActions = {}

// Import default actions
const importActions = ['findOneAndUpdate', 'findById', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

// Controller custom actions
const customMethods = {
  find: (req, res) => {
    let query = createQueryObject(req)

    if (req.query.filter && req.query.filter.length) {
      let regex = new RegExp(req.query.filter, 'i')
      query = Object.assign(query, {
        '$or': [
          {title: regex},
          {description: regex},
          {file: regex},
          {type: regex}
        ]
      })
    }

    const pagOptions = {
      page: Number.parseInt(req.query.page - 1) || 0,
      limit: Number.parseInt(req.query.limit) || 15
    }

    Model
      .find(query)
      .count()
      .exec((err, count) => {
        if (err) throw err
        const meta = {
          currentPage: (pagOptions.page + 1),
          limit: pagOptions.limit,
          totalPages: Math.ceil(count / pagOptions.limit)
        }
        Model
        .find(query)
        .sort({'created_at': -1})
        .skip(pagOptions.page * pagOptions.limit)
        .limit(pagOptions.limit)
        .populate('last_updated_by')
        .exec((err, data) => {
          if (err) throw err
          const response = {
            documents: data,
            meta: meta
          }
          res.status(200).json(response)
        })
      })
  },
  create: (req, res) => {
    const data = req.body
    data['last_updated_by'] = jwtHelper.getUserId(req)
    const modelInstance = new Model(data)

    modelInstance.save((err, data) => {
      if (err) throw err
      data
      .populate('last_updated_by', (err, documents) => {
        if (err) throw err
        res.status(200).json(documents)
      })
    })
  },
  update: (req, res) => {
    const query = {_id: req.params.id}
    const data = req.body
    data['last_updated_by'] = jwtHelper.getUserId(req)

    Model.findOneAndUpdate(query, {$set: data}, {new: true}, (err, data) => {
      if (err) throw err

      data
      .populate('last_updated_by', (err, documents) => {
        if (err) throw err
        res.status(200).json(documents)
      })
    })
  }
  // create: (req, res) => {
  //   const data = req.body
  //   data['last_updated_by'] = jwtHelper.getUserId(req)
  //   const modelInstance = new Model(data)
  //
  //   const file = req.file
  //   const path = file.path
  //   const modelPath = `files/${data.type}/${data._id}`
  //   const localPath = `${process.cwd()}/public/${modelPath}`
  //   if (!fs.existsSync(localPath)) {
  //     fs.mkdirSync(localPath)
  //   }
  //
  //   const newFile = localPath + '/' + file.name
  //   fs.rename(path, newFile, (err) => {
  //     if (err) {
  //       res.status(500).json({error: err})
  //     }
  //
  //     modelInstance['file'] = `${modelPath}/${file.name}`
  //     modelInstance.save((err, data) => {
  //       if (err) throw err
  //
  //       res.status(201).json(modelInstance)
  //     })
  //   })
  // },
  // update: (req, res) => {
  //   const query = {_id: req.params.id}
  //   const mod = req.body
  //   const file = req.file
  //
  //   if (file) {
  //     Model
  //       .find(query)
  //       .exec((err, data) => {
  //         if (err) throw err
  //
  //         const path = file.path
  //         const modelPath = `files/${data.type}/${data._id}`
  //         const localPath = `${process.cwd()}/public/${modelPath}`
  //         if (!fs.existsSync(localPath)) {
  //           fs.mkdirSync(localPath)
  //         }
  //
  //         const newFile = localPath + '/' + file.name
  //         fs.rename(path, newFile, (err) => {
  //           if (err) {
  //             res.status(500).json({error: err})
  //           }
  //
  //           data['file'] = `${modelPath}/${file.name}`
  //           data.save((err, data) => {
  //             if (err) throw err
  //
  //             res.status(200).json(data)
  //           })
  //         })
  //       })
  //   } else {
  //     findOneAndUpdate(query, mod, res)
  //   }
  // }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
