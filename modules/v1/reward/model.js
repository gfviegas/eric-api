const mongoose = require('mongoose')
const modelName = 'rewards'

// {"type":"badge","gifted":{"group":{"number":"83","name":"Olave Saint Clair"},"name":"Maria da Silva","register":"065432-1"}}
const structure = {
  type: {
    type: String,
    required: true,
    enum: ['badge', 'reward', 'sower']
  },
  status: {
    type: String,
    enum: ['waiting', 'analyzing', 'issued', 'rejected', 'approved'],
    default: 'waiting'
  },
  resume: {
    type: String
  },
  reward: {
    type: String
  },
  author: {
    name: {
      type: String,
      required: true
    },
    register: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    cellphone: {
      type: String
    },
    role: {
      type: String
    },
    group: {
      number: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
  },
  gifted: {
    name: {
      type: String,
      required: true
    },
    register: {
      type: String,
      required: true
    },
    group: {
      number: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
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
