require('dotenv').config()
const rfr = require('rfr')
const seeder = require('./seeder')

const chalk = require('chalk')
const error = chalk.bold.red
const success = chalk.bold.green
const info = chalk.bold.blue

const seedUsers = () => {
  console.log(info('\n**** Seeding Users... ****\n'))
  const model = rfr('modules/v1/user/model').model
  const data = require('./users')

  // TODO: Validar se tem algum usuario que ja existe, se tiver remover.
  // model.find(data).exec()
  //   .then()

  return seeder.seed(model, data)
  .then(() => {
    console.log(success('\n**** Seeded Users ****\n'))
  })
  .catch((err) => {
    console.log(error('\n**** Error seeding Users ****\n'))
    console.log(error(err))
    console.log(error('\n**** -- ****\n'))
    process.exit(0)
  })
}

const seedDistricts = () => {
  console.log(info('\n**** Seeding Districts... ****\n'))
  const model = rfr('modules/v1/district/model').model
  const data = require('./districts')

  return seeder.clearAndSeed(model, data)
  .then(() => {
    console.log(success('\n**** Seeded Districts ****\n'))
  })
  .catch((err) => {
    console.log(error('\n**** Error seeding Districts ****\n'))
    console.log(error(err))
    console.log(error('\n**** -- ****\n'))
    process.exit(0)
  })
}

const execute = () => {
  const funcs = [seedDistricts, seedUsers]
  let p = Promise.resolve()
  funcs.forEach((func) => {
    p = p.then(() => { return func() })
  })
  return p
}

seeder.connect().then(() => {
  console.log(success('**** DB connected sucessfully **** \n'))
  execute()
    .then(response => {
      console.log(success(`\n ### All Seeds done!  ### \n`))
      process.exit(1)
    })
    .catch(error => console.log(error(error)))
}).catch((err) => {
  console.log(error(err))
})
