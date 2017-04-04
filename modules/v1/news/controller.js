const fs = require('fs')
const rfr = require('rfr')
const actionsPath = './actions/'
const Model = require('./model').model
const extend = require('extend')
const jwtHelper = rfr('helpers/jwt')
const ObjectId = require('mongoose').Types.ObjectId
const FB = rfr('helpers/facebook')
const jimp = require('jimp')

const controllerActions = {}

// Import default actions
const importActions = ['findOneAndUpdate', 'update', 'remove']
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

const createFacebookPost = (instance) => {
  const data = {
    published: false,
    message: `Notícias! ${instance.title} - Veja mais no link. #Escoteiros #EscoteirosDeMinas`,
    link: `${process.env.NEWS_URL}${instance.slug}`,
    scheduled_publish_time: Math.round(new Date().getTime() / 1000) + (60 * 60)
  }
  FB.api(`${process.env.FB_PAGE}/feed`, 'post', data, (res) => {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error)
      console.log(data, FB.getAccessToken())
      return false
    }

    const query = {_id: instance._id}
    const mod = {$set: {fb_post_id: (res.post_id || res.id)}}
    Model.findOneAndUpdate(query, mod, {new: true}, (err, data) => {
      if (err) throw err
    })
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
    const query = {}
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
            news: data,
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
      .populate('last_updated_by', (err, news) => {
        if (err) throw err
        res.status(200).json(news)

        // Post on facebook after 5 minutes
        setTimeout(() => { createFacebookPost(data) }, (60 * 5) * 1000)
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
        fileName = `image.jpg`
      } else if (file.mimetype === 'image/png') {
        fileName = `image.png`
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
    } else {
      findOneAndUpdate(query, mod, res)
    }
  },
  updateViews: (req, res) => {
    const query = {_id: req.params.id}
    const views = req.body.views

    Model.findOneAndUpdate(query, {$set: {views: views}}, {new: true}, (err, data) => {
      if (err) throw err

      res.status(200).json(data)
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
