'use strict'

require('date-utils')
const fs = require('fs')

const expect = require('chai').expect
const sinon = require('sinon')
const mock = require('mock-fs')

const backup = require('../bin/simple_file_backup')

describe('backup', function () {
  beforeEach(function () {
    mock({
      'mockSource': {
        'my-file.txt': 'test content'
      },
      'mockTarget': {/* empty dir */}
    })

    sinon.spy(fs, 'createReadStream')
    sinon.spy(fs, 'createWriteStream')
  })

  afterEach(function () {
    mock.restore()

    fs.createReadStream.restore()
    fs.createWriteStream.restore()
  })

  it('should read the source file', function () {
    var promise = backup('mockSource/my-file.txt', 'mockTarget')

    return promise.then(function () {
      sinon.assert.calledOnce(fs.createReadStream)
    })
  })

  it('should write the source file', function () {
    var promise = backup('mockSource/my-file.txt', 'mockTarget')

    return promise.then(function () {
      sinon.assert.calledOnce(fs.createWriteStream)
    })
  })

  it('should write the source file with a default date extension', function () {
    var promise = backup('mockSource/my-file.txt', 'mockTarget')
    var d = new Date();
    d = d.toFormat('YYYYMMDD')

    return promise.then(function () {
      sinon.assert.calledOnce(fs.createWriteStream)
      expect(fs.statSync('mockTarget/my-file.txt.' + d).isFile()).to.be.true
    })
  })

  it('should write the source file with no added extension if "pure" option passed in', function () {
    var promise = backup('mockSource/my-file.txt', 'mockTarget', {extension: 'pure'})

    return promise.then(function () {
      sinon.assert.calledOnce(fs.createWriteStream)
      expect(fs.statSync('mockTarget/my-file.txt').isFile()).to.be.true
    })
  })
})
