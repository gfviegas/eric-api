require('dotenv').config()
const rfr = require('rfr')
const seeder = require('./seeder')

const seedDistricts = () => {
  console.log('**** Seeding Districts... ****')
  const model = rfr('modules/v1/district/model').model
  const data = require('./districts')

  seeder.seed(model, data).then(() => {
    console.log('**** Seeded Districts ****')
  }).catch((err) => {
    console.log('**** Error seeding Districts ****')
    console.error(err)
    console.log('**** -- ****')
  })
}

const execute = () => {
  const funcs = [seedDistricts]

  let p = Promise.resolve()

  funcs.forEach((func) => {
    p = p.then(() => { return func() })
  })
  return p
}

seeder.connect().then(() => {
  console.log('**** DB connected sucessfully ****')
  execute()
    .then(response => {
      console.log(`\n ### All Seeds done!  ### \n`)
      process.exit(1)
    })
    .catch(error => console.error('Erro', error))
}).catch((err) => {
  console.error(err)
})
