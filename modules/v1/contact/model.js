const mongoose = require('mongoose')
const modelName = 'contacts-request'

const structure = {
  type: {
    type: String,
    required: true,
    enum: ['question', 'compliment', 'complaint', 'suggestion', 'other']
  },
  target: {
    type: String,
    required: true,
    enum: ['communication', 'reward', 'growth', 'office', 'financial', 'adults', 'institutional', 'youngs', 'legal', 'ombudsman', 'educative']
  },
  message: {
    type: String
  },
  author: {
    name: {
      type: String,
      required: true
    },
    email: {
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

const emails = {
  communication: 'comunicacao@escoteirosmg.org.br',
  reward: 'condecoracoes@escoteirosmg.org.br',
  growth: 'marcos.vieira@escoteirosmg.org.br',
  office: 'escritorio@escoteirosmg.org.br',
  financial: 'giovani.ramos@escoteirosmg.org.br',
  adults: 'gestao.adultos@escoteirosmg.org.br',
  institutional: 'marcos.vieira@escoteirosmg.org.br',
  youngs: 'b.runadeandrade@hotmail.com',
  legal: 'kirkpereira@hotmail.com',
  ombudsman: 'ouvidoria@escoteirosmg.org.br',
  educative: 'rodrigo.martins@escoteirosmg.org.br'
}

const getContactType = (type) => {
  const typeAlias = {
    question: 'Dúvida',
    compliment: 'Elogio',
    complaint: 'Reclamação',
    suggestion: 'Sugestão',
    other: 'Outro'
  }

  return typeAlias[type]
}

const getContactTarget = (target) => {
  const targetAlias = {
    communication: 'Comunicação',
    reward: 'Condecorações',
    growth: 'Crescimento',
    office: 'Escritório',
    financial: 'Financeiro',
    adults: 'Gestão de Adultos',
    institutional: 'Gestão Institucional',
    youngs: 'Jovens Líderes',
    legal: 'Jurídico',
    ombudsman: 'Ouvidoria',
    educative: 'Programa Educativo'
  }

  return targetAlias[target]
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
  getContactTarget: getContactTarget,
  getContactType: getContactType,
  emails: emails,
  schema: schema,
  model: model
}
