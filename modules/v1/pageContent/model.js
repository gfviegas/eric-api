const mongoose = require('mongoose')
const modelName = 'page-content'

const structure = {
  name: {
    type: String,
    required: true
  },
  content: [
    {
      name: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }
  ],
  url_reference: {
    type: String
  },
  last_updated_by: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user'
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
