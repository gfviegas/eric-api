const fs = require('fs')
const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const ObjectId = require('mongoose').Types.ObjectId
const jimp = require('jimp')

const jwtHelper = rfr('helpers/jwt')
const errorHandler = rfr('helpers/error')
const FB = rfr('helpers/facebook')
const prerender = rfr('helpers/prerender')
const createQueryObject = rfr('helpers/request').createQueryObject

const controllerActions = {}

// Import default actions
const importActions = ['findOneAndUpdate', 'remove']
const createMethods = (element, index) => {
  controllerActions[element] = rfr(actionsPath + element)(Model)
}
importActions.forEach(createMethods)

const createFacebookPost = (instance) => {
  const eventUrl = `${process.env.EVENTS_URL}${instance.slug}`
  prerender.recache(eventUrl)
  .then(() => {
    const data = {
      published: false,
      message: `Eventos! ${instance.title} - Veja mais no link. #Escoteiros #EscoteirosDeMinas`,
      link: eventUrl,
      scheduled_publish_time: Math.round(new Date().getTime() / 1000) + (60 * 60)
    }
    FB.api(`${process.env.FB_PAGE}/feed`, 'post', data, (res) => {
      if (!res || res.error) {
        errorHandler.sendMail({message: `Erro ao postar o evento ${eventUrl}.`, trace: JSON.stringify(res.error)})
        return false
      }

      const query = {_id: instance._id}
      const mod = {$set: {fb_post_id: (res.post_id || res.id)}}
      Model.findOneAndUpdate(query, mod, {new: true}, (err, data) => {
        if (err) {
          errorHandler.sendMail({message: `Erro ao atualizar o evento pós-postagem ${eventUrl}.`, trace: JSON.stringify(err)})
          throw err
        }
      })
    })
  })
  .catch(() => {
    errorHandler.sendMail({message: `Erro ao limpar o cache do prerender da url ${eventUrl}. O post no facebook não foi criado.`})
  })
}

// Controller custom actions
const customMethods = {
  findByIdOrSlug: (req, res) => {
    const query = (ObjectId.isValid(req.params.id)) ? {_id: req.params.id} : {slug: req.params.id}
    Model.findOne(query, (err, data) => {
      if (err) throw err
      res.status(200).json(data)
    })
  },
  find: (req, res) => {
    let query = createQueryObject(req)

    if (req.query.filter && req.query.filter.length) {
      let regex = new RegExp(req.query.filter, 'i')
      query = Object.assign(query, {
        '$or': [
          {title: regex},
          {description: regex},
          {place: regex},
          {section: regex},
          {host: regex},
          {slug: regex}
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
            events: data,
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

    if (req.files) {
      const file = req.files.image
      const modelPath = `events/${modelInstance._id}`
      const localPath = `${process.cwd()}/public/${modelPath}`

      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath)
      }

      const newFile = localPath + '/' + file.name
      fs.writeFile(newFile, file.data, (err) => {
        if (err) {
          res.status(500).json({error: err})
        }

        modelInstance['image'] = `${modelPath}/${file.name}`
        modelInstance.save((err, data) => {
          if (err) throw err
          data
          .populate('last_updated_by', (err, events) => {
            if (err) throw err
            res.status(201).json(events)

            // Post on facebook after 5 minutes
            setTimeout(() => { createFacebookPost(data) }, (60 * 5) * 1000)
          })
        })
      })
    } else {
      modelInstance.save((err, data) => {
        if (err) throw err
        data
        .populate('last_updated_by', (err, events) => {
          if (err) throw err
          res.status(201).json(events)

          // Post on facebook after 5 minutes
          setTimeout(() => { createFacebookPost(data) }, (60 * 5) * 1000)
        })
      })
    }
  },
  update: (req, res) => {
    const mod = req.body
    mod['last_updated_by'] = jwtHelper.getUserId(req)
    Model.findByIdAndUpdate(req.params.id, {$set: mod}, {new: true}, (err, modelInstance) => {
      if (err) throw err

      if (!modelInstance) res.status(404).json({error: 'event_not_found'})

      if (req.files) {
        const file = req.files.image
        const modelPath = `events/${modelInstance._id}`
        const localPath = `${process.cwd()}/public/${modelPath}`

        if (!fs.existsSync(localPath)) {
          fs.mkdirSync(localPath)
        }

        let fileName = ''
        if (file.mimetype === 'image/jpeg' || 'image/jpg') {
          fileName = `image.jpg`
        } else if (file.mimetype === 'image/png') {
          fileName = `image.png`
        } else {
          return res.status(422).json({format: 'invalid_format'})
        }

        const newFile = localPath + '/' + fileName
        fs.writeFile(newFile, file.data, (err) => {
          if (err) {
            res.status(500).json({error: err})
          }

          modelInstance['image'] = `${modelPath}/${fileName}`
          modelInstance.save((err, data) => {
            if (err) throw err
            data
            .populate('last_updated_by', (err, events) => {
              if (err) throw err
              res.status(200).json(events)

              jimp.read(newFile)
              .then((image) => {
                image.resize(480, 480)
                .quality(90)
                .write(newFile)
              })
              .catch((error) => {
                throw error
              })
            })
          })
        })
      } else {
        res.status(200).json(modelInstance)
      }
    })
  },
  rescrape: (req, res) => {
    const query = {_id: req.params.id}

    Model.findOne(query, (err, events) => {
      if (err) throw err

      const eventUrl = `${process.env.EVENTS_URL}${events.slug}`
      prerender.recache(eventUrl)
      .then(() => {
        const data = {
          id: eventUrl,
          scrape: true
        }

        FB.api('/', 'post', data, (response) => {
          if (!response || response.error) {
            errorHandler.sendMail({message: `Erro ao atualizar o cache do evento ${eventUrl}.`, trace: JSON.stringify(response.error)})
            res.status(500).json({error: response.error})
            return false
          }

          res.status(200).json({success: true})
        })
      })
      .catch((error) => {
        res.status(500).json({error: error})
        errorHandler.sendMail({message: `Erro ao limpar o cache do prerender da url ${eventUrl}. Chamada de atualização de scrape.`})
      })
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
