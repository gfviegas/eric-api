const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const controller = rfr('./modules/v1/user/controller')

describe('Module Document: Controller', () => {
  it('should have all routes required methods registred', () => {
    expect(controller).to.contain.all.keys(['findOneAndUpdate', 'findById', 'remove', 'find', 'create', 'update'])
  })

  describe('Method find', () => {
    it('should be a function', () => {
      expect(controller.find).to.be.a('function')
    })
  })

  describe('Method create', () => {
    it('should be a function', () => {
      expect(controller.create).to.be.a('function')
    })
  })

  describe('Method update', () => {
    it('should be a function', () => {
      expect(controller.update).to.be.a('function')
    })
  })
})
