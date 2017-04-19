const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const request = rfr('./tests/helpers/request')
const validators = rfr('./modules/v1/news/validators')

describe('Module News: Validators', () => {
  let req
  let checkBody
  let notEmpty
  let len
  let getValidationResult
  let checkParams

  beforeEach(() => {
    req = request.stubReq()
    checkParams = request.stubCheckParams(req)
    checkBody = request.stubCheckBody(req)
    notEmpty = request.stubNotEmpty(req)
    len = request.stubLen(req)
    getValidationResult = request.stubGetValidationResult(req)
  })

  afterEach(() => {
    checkParams.restore()
    checkBody.restore()
    notEmpty.restore()
    len.restore()
    getValidationResult.restore()
  })

  it('should have all the required methods registred', () => {
    expect(validators).to.contain.all.keys(['create', 'update', 'uniqueSlugValidator', 'updateViews'])
  })

  describe('Method Create', () => {
    beforeEach(() => {
      validators.create(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.create).to.be.a('function')
    })
    it('should call checkBody 5 times', () => {
      expect(checkBody.called).to.be.true
      expect(checkBody.callCount).to.equal(5)
    })
    it('should call notEmpty 3 times', () => {
      expect(notEmpty.called).to.be.true
      expect(notEmpty.callCount).to.equal(3)
    })
    it('should call len twice', () => {
      expect(len.called).to.be.true
      expect(len.callCount).to.equal(2)
    })
    it('should verify title required', () => {
      expect(checkBody.calledWith('title', {error: 'required'})).to.be.true
    })
    it('should verify title length', () => {
      expect(checkBody.calledWith('title', {error: 'length', min: 4, max: 100})).to.be.true
      expect(len.calledWith(4, 100)).to.be.true
    })
    it('should verify content required', () => {
      expect(checkBody.calledWith('content', {error: 'required'})).to.be.true
    })
    it('should verify slug required', () => {
      expect(checkBody.calledWith('slug', {error: 'required'})).to.be.true
    })
    it('should verify slug length', () => {
      expect(checkBody.calledWith('slug', {error: 'length', min: 4, max: 100})).to.be.true
      expect(len.calledWith(4, 100)).to.be.true
    })
  })

  describe('Method Update', () => {
    beforeEach(() => {
      validators.update(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.update).to.be.a('function')
    })
    it('should call checkBody 2 times', () => {
      expect(checkBody.called).to.be.true
      expect(checkBody.callCount).to.equal(2)
    })
    it('should call len 2 times', () => {
      expect(len.called).to.be.true
      expect(len.callCount).to.equal(2)
    })
    it('should verify title length', () => {
      expect(checkBody.calledWith('title', {error: 'length', min: 4, max: 100})).to.be.true
      expect(len.calledWith(4, 100)).to.be.true
    })
    it('should verify slug length', () => {
      expect(checkBody.calledWith('slug', {error: 'length', min: 4, max: 100})).to.be.true
      expect(len.calledWith(4, 100)).to.be.true
    })
  })

  describe('Method Update Views', () => {
    beforeEach(() => {
      validators.updateViews(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.updateViews).to.be.a('function')
    })
    it('should call checkBody once', () => {
      expect(checkBody.called).to.be.true
      expect(checkBody.callCount).to.equal(1)
    })
    it('should call notEmpty once', () => {
      expect(notEmpty.called).to.be.true
      expect(notEmpty.callCount).to.equal(1)
    })
    it('should verify views required', () => {
      expect(checkBody.calledWith('views', {error: 'required'})).to.be.true
    })
  })

  describe('Method Unique Slug Validator', () => {
    beforeEach(() => {
      // validators.uniqueSlugValidator(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.uniqueSlugValidator).to.be.a('function')
    })
  })
})
