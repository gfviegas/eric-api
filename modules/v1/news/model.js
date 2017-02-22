const mongoose = require('mongoose')
const modelName = 'news'

const structure = {
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: 'news/no_image.jpg'
  },
  content: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  last_updated_by: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  fb_post_id: {
    required: false,
    type: String
  }
}

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const schema = mongoose.Schema(structure, options)
const model = mongoose.model(modelName, schema)

module.exports = {
  schema: schema,
  model: model
}
