const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const connect = () => {
  return mongoose.connect(process.env.DB_HOST)
}

const clearModel = (Model, cb) => {
  return Model.remove({}, cb)
}

const seed = (Model, data) => {
  return new Promise((resolve, reject) => {
    clearModel(Model, err => {
      if (err) throw err
      Model.create(data).then(data => resolve(data)).catch(data => reject(0))
    })
  })
}

module.exports = {
  connect,
  clearModel,
  seed
}
