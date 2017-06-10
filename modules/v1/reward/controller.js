const rfr = require('rfr')
const fs = require('fs')
const actionsPath = './actions/'
const modelRequired = require('./model')
const Model = modelRequired.model
const emails = modelRequired.emails
const extend = require('extend')
const mailer = rfr('helpers/mailer')
const createQueryObject = rfr('helpers/request').createQueryObject

const controllerActions = {}

// Import default actions
const importActions = ['findById', 'update', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

const sendCreateEmail = (modelInstance) => {
  let options = {}
  if (modelInstance.type === 'badge') {
    options = {
      to: emails[modelInstance.type],
      subject: 'Nova Solicitação de Distintivo Especial',
      template: {
        path: 'badge/new',
        data: modelInstance.toObject()
      }
    }
  } else if (modelInstance.type === 'reward') {
    options = {
      to: emails[modelInstance.type],
      subject: 'Nova Solicitação de Condecoração/Recompensa',
      template: {
        path: 'reward/new',
        data: modelInstance.toObject()
      }
    }
  } else if (modelInstance.type === 'sower') {
    options = {
      to: emails[modelInstance.type],
      subject: 'Nova Solicitação de Distintivo de Semeador',
      template: {
        path: 'sower/new',
        data: modelInstance.toObject()
      }
    }
  } else if (modelInstance.type === 'level') {
    options = {
      to: emails[modelInstance.type],
      subject: 'Nova Solicitação de Nível',
      template: {
        path: 'level/new',
        data: modelInstance.toObject()
      }
    }
  } else if (modelInstance.type === 'book') {
    options = {
      to: emails[modelInstance.type],
      subject: 'Nova Solicitação de Caderno/Projeto',
      template: {
        path: 'book/new',
        data: modelInstance.toObject()
      }
    }
  }

  if (options !== {}) mailer.sendMail(options)
}

// Controller custom actions
const customMethods = {
  find: (req, res) => {
    let query = createQueryObject(req)

    if (req.query.filter && req.query.filter.length) {
      let regex = new RegExp(req.query.filter, 'i')
      query = Object.assign(query, {
        '$or': [
          {title: regex},
          {reward: regex},
          {reward: regex},
          {'author.name': regex},
          {'author.group.name': regex},
          {'gifted.name': regex},
          {'gifted.group.name': regex}
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
            requests: data,
            meta: meta
          }
          res.status(200).json(response)
        })
      })
  },
  create: (req, res) => {
    const data = req.body
    const modelInstance = new Model(data)

    if (req.files) {
      const file = req.files.file
      const modelPath = `files/rewards/${modelInstance.type}/${modelInstance._id}`
      const localPath = `${process.cwd()}/public/${modelPath}`

      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath)
      }

      const newFile = localPath + '/' + file.name
      fs.writeFile(newFile, file.data, (err) => {
        if (err) {
          res.status(500).json({error: err})
        }

        modelInstance['file'] = `${modelPath}/${file.name}`
        modelInstance.save((err, data) => {
          if (err) throw err

          res.status(201).json(modelInstance)
          sendCreateEmail(modelInstance)
        })
      })
    } else {
      modelInstance.save((err, data) => {
        if (err) throw err

        res.status(201).json(modelInstance)
        sendCreateEmail(modelInstance)
      })
    }
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
      } else if (data.type === 'level') {
        options = {
          to: emails[data.type],
          subject: 'Atualização de Solicitação de Nível 👌 👀',
          template: {
            path: 'level/new',
            data: data.toObject()
          }
        }
      } else if (data.type === 'book') {
        options = {
          to: emails[data.type],
          subject: 'Atualização de Solicitação de Caderno/Projeto 👌 👀',
          template: {
            path: 'book/new',
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
