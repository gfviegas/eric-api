const mongoose = require('mongoose')
const modelName = 'rewards'

// {"type":"badge","gifted":{"group":{"number":"83","name":"Olave Saint Clair"},"name":"Maria da Silva","register":"065432-1"}}
const structure = {
  type: {
    type: String,
    required: true,
    enum: ['badge', 'reward', 'sower', 'level', 'book']
  },
  status: {
    type: String,
    enum: ['waiting', 'analyzing', 'issued', 'rejected', 'approved'],
    default: 'waiting'
  },
  resume: {
    type: String
  },
  reply: {
    type: String
  },
  reward: {
    type: String
  },
  file: {
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
    },
    formation: {
      lines: {
        type: String
      },
      levels: {
        type: String
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
    email: {
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
  }
}

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const emails = {
  badge: 'rodrigo.martins@escoteirosmg.org.br',
  reward: 'condecoracoes@escoteirosmg.org.br',
  sower: 'condecoracoes@escoteirosmg.org.br',
  level: 'gestao.adultos@escoteirosmg.org.br',
  book: 'gestao.adultos@escoteirosmg.org.br'
}

const schema = mongoose.Schema(structure, options)
const model = mongoose.model(modelName, schema)

module.exports = {
  emails: emails,
  schema: schema,
  model: model
}
