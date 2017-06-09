const mongoose = require('mongoose')
const modelName = 'documents'

const structure = {
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['book', 'notice', 'resolution', 'ordinance', 'balance', 'minute', 'other'],
    required: true
  },
  file: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  last_updated_by: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
