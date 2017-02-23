const mongoose = require('mongoose')
const modelName = 'events'

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
    default: 'events/no_image.jpg'
  },
  description: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Regional', 'Distrital', 'Nacional', 'Internacional', 'Outro'],
    required: true
  },
  files: [{
    path: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }]
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
