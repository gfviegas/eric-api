const mongoose = require('mongoose')
const modelName = 'events'

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const fileStructure = {
  path: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
}
const fileSchema = mongoose.Schema(fileStructure, options)

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
  section: [{
    type: String,
    enum: ['Ramo Lobinho', 'Ramo Escoteiro', 'Ramo Sênior', 'Ramo Pioneiro', 'Adultos'],
    required: false
  }],
  host: {
    type: String,
    enum: ['Regional', 'Distrital', 'Nacional', 'Internacional', 'Outro'],
    required: true
  },
  files: [fileSchema]
}

const schema = mongoose.Schema(structure, options)
const model = mongoose.model(modelName, schema)

module.exports = {
  schema: schema,
  model: model
}
