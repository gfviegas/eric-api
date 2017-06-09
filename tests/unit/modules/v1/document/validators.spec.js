const rfr = require('rfr')
const chai = require('chai')
const expect = chai.expect

const request = rfr('./tests/helpers/request')
const validators = rfr('./modules/v1/document/validators')

describe('Module Document: Validators', () => {
  let req
  let checkBody
  let notEmpty
  let isMongoId
  let isIn
  let getValidationResult
  let checkParams

  beforeEach(() => {
    req = request.stubReq()
    checkParams = request.stubCheckParams(req)
    checkBody = request.stubCheckBody(req)
    notEmpty = request.stubNotEmpty(req)
    isMongoId = request.stubIsMongoId(req)
    isIn = request.stubIsIn(req)
    getValidationResult = request.stubGetValidationResult(req)
  })

  afterEach(() => {
    checkParams.restore()
    checkBody.restore()
    notEmpty.restore()
    isMongoId.restore()
    isIn.restore()
    getValidationResult.restore()
  })

  it('should have all the required methods registred', () => {
    expect(validators).to.contain.all.keys(['find', 'create', 'replace', 'update'])
  })

  describe('Method Find', () => {
    beforeEach(() => {
      validators.find(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.find).to.be.a('function')
    })
    it('should call checkParams once', () => {
      expect(checkParams.called).to.be.true
      expect(checkParams.callCount).to.equal(1)
    })
    it('should call isMongoId once', () => {
      expect(isMongoId.called).to.be.true
      expect(isMongoId.callCount).to.equal(1)
    })
    it('should verify id valid', () => {
      expect(checkParams.calledWith('id', {error: 'invalid'})).to.be.true
    })
  })

  describe('Method Create', () => {
    beforeEach(() => {
      validators.create(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.create).to.be.a('function')
    })
    it('should call checkBody 3 times', () => {
      expect(checkBody.called).to.be.true
      expect(checkBody.callCount).to.equal(3)
    })
    it('should call notEmpty 2 times', () => {
      expect(notEmpty.called).to.be.true
      expect(notEmpty.callCount).to.equal(2)
    })
    it('should call isIn once', () => {
      expect(isIn.called).to.be.true
      expect(isIn.callCount).to.equal(1)
    })
    it('should verify type required', () => {
      expect(checkBody.calledWith('type', {error: 'required'})).to.be.true
    })
    it('should verify type valid', () => {
      expect(checkBody.calledWith('type', {error: 'invalid'})).to.be.true
      expect(isIn.calledWith(['book', 'notice', 'resolution', 'ordinance', 'balance', 'minute', 'other'])).to.be.true
    })
  })

  describe('Method Replace', () => {
    beforeEach(() => {
      validators.replace(req, request.res, () => {})
    })
    it('should be a function', () => {
      expect(validators.replace).to.be.a('function')
    })
    it('should call checkBody 4 times', () => {
      expect(checkBody.called).to.be.true
      expect(checkBody.callCount).to.equal(4)
    })
    it('should call notEmpty 3 times', () => {
      expect(notEmpty.called).to.be.true
      expect(notEmpty.callCount).to.equal(3)
    })
    it('should call isIn once', () => {
      expect(isIn.called).to.be.true
      expect(isIn.callCount).to.equal(1)
    })
    it('should verify type required', () => {
      expect(checkBody.calledWith('type', {error: 'required'})).to.be.true
    })
    it('should verify type valid', () => {
      expect(checkBody.calledWith('type', {error: 'invalid'})).to.be.true
      expect(isIn.calledWith(['book', 'notice', 'resolution', 'ordinance', 'balance', 'minute', 'other'])).to.be.true
    })
    it('should verify file required', () => {
      expect(checkBody.calledWith('file', {error: 'required'})).to.be.true
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
    it('should call notEmpty 1 times', () => {
      expect(notEmpty.called).to.be.true
      expect(notEmpty.callCount).to.equal(1)
    })
    it('should call isIn once', () => {
      expect(isIn.called).to.be.true
      expect(isIn.callCount).to.equal(1)
    })
    it('should verify type valid', () => {
      expect(checkBody.calledWith('type', {error: 'invalid'})).to.be.true
      expect(isIn.calledWith(['book', 'notice', 'resolution', 'ordinance', 'balance', 'minute', 'other'])).to.be.true
    })
  })
})
