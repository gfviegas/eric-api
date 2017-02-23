const mongoose = require('mongoose')
const modelName = 'districts'

const structure = {
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  links: [{
    facebook: String,
    twitter: String,
    site: String,
    instagram: String
  }],
  director: {
    type: String,
    required: true
  },
  groups: [{
    number: {
      required: true,
      type: Number
    },
    name: {
      required: true,
      type: String
    },
    city: {
      type: String
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
