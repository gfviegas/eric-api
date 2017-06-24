const mongoose = require('mongoose')
const modelName = 'user'

const structure = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true,
    bcrypt: true,
    select: false
  },
  roles: [{
    type: String
  }],
  passwordToken: {
    type: String,
    required: false,
    select: false
  }
}

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const schema = mongoose.Schema(structure, options)
schema.plugin(require('mongoose-bcrypt'), {rounds: 10})

const model = mongoose.model(modelName, schema)

module.exports = {
  schema: schema,
  model: model
}
