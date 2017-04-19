const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const controller = rfr('./modules/v1/news/controller')

describe('Module News: Controller', () => {
  it('should have all routes required methods registred', () => {
    expect(controller).to.contain.all.keys(['findOneAndUpdate', 'remove', 'findByIdOrSlug', 'find', 'create', 'update', 'updateViews'])
  })

  describe('Method findByIdOrSlug', () => {
    it('should be a function', () => {
      expect(controller.findByIdOrSlug).to.be.a('function')
    })
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

  describe('Method updateViews', () => {
    it('should be a function', () => {
      expect(controller.updateViews).to.be.a('function')
    })
  })
})
