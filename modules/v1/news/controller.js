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
const onesignal = rfr('helpers/onesignal')
const createQueryObject = rfr('helpers/request').createQueryObject

const controllerActions = {}

// Import default actions
const importActions = ['findOneAndUpdate', 'remove']
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

const clearCacheAndDispatch = (instance) => {
  const newsUrl = `${process.env.NEWS_URL}${instance.slug}`
  prerender.recache(newsUrl)
  .then(() => {
    createFacebookPost(instance, newsUrl)
    sendNotification(instance, newsUrl)
  })
  .catch(() => {
    errorHandler.sendMail({message: `Erro ao limpar o cache do prerender da url ${newsUrl}.`})
  })
}

const createFacebookPost = (instance, newsUrl) => {
  const data = {
    published: false,
    message: `Notícias! ${instance.title} - Veja mais no link. #Escoteiros #EscoteirosDeMinas`,
    link: newsUrl,
    scheduled_publish_time: Math.round(new Date().getTime() / 1000) + (60 * 60)
  }
  FB.api(`${process.env.FB_PAGE}/feed`, 'post', data, (res) => {
    if (!res || res.error) {
      errorHandler.sendMail({message: `Erro ao postar a noticia ${newsUrl}.`, trace: JSON.stringify(res.error)})
      return false
    }

    const query = {_id: instance._id}
    const mod = {$set: {fb_post_id: (res.post_id || res.id)}}
    Model.findOneAndUpdate(query, mod, {new: true}, (err, data) => {
      if (err) {
        errorHandler.sendMail({message: `Erro ao atualizar a noticia pós-postagem ${newsUrl}.`, trace: JSON.stringify(err)})
        throw err
      }
    })
  })
}

const sendNotification = (instance, newsUrl) => {
  const options = {
    image: `${process.env.ASSETS_URL}${instance.image}`,
    url: newsUrl,
    title: `Escoteiros de Minas | Notícias`,
    message: `${instance.title} - Confira nossa notícia!`
  }

  onesignal.sendNotification(options)
  .then(() => {
    console.log('Notificação Enviada')
  })
  .catch(() => {
    errorHandler.sendMail({message: `Erro ao enviar a notificação pra OneSignal da notícia ${newsUrl}.`})
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
          {content: regex},
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
        setTimeout(() => { clearCacheAndDispatch(data) }, (60 * 5) * 1000)
      })
    })
  },
  update: (req, res) => {
    const query = {_id: req.params.id}
    const mod = req.body
    mod['last_updated_by'] = jwtHelper.getUserId(req)

    const file = (req.files && req.files.image) ? req.files.image : false
    if (file) {
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
      fs.writeFile(newFile, file.data, (err) => {
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
  },
  rescrape: (req, res) => {
    const query = {_id: req.params.id}

    Model.findOne(query, (err, news) => {
      if (err) throw err

      const newsUrl = `${process.env.NEWS_URL}${news.slug}`
      prerender.recache(newsUrl)
      .then(() => {
        const data = {
          id: newsUrl,
          scrape: true
        }

        FB.api('/', 'post', data, (response) => {
          if (!response || response.error) {
            errorHandler.sendMail({message: `Erro ao atualizar o cache da noticia ${newsUrl}.`, trace: JSON.stringify(response.error)})
            res.status(500).json({error: response.error})
            return false
          }

          res.status(200).json({success: true})
        })
      })
      .catch((error) => {
        res.status(500).json({error: error})
        errorHandler.sendMail({message: `Erro ao limpar o cache do prerender da url ${newsUrl}. Chamada de atualização de scrape.`})
      })
    })
  }
}

extend(controllerActions, customMethods)
module.exports = controllerActions
