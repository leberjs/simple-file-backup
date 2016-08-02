'use strict'

require('date-utils')
var fs = require('fs')
var path = require('path')

function getExtension(extensionOptions) {
  var dot = '.'

  if (extensionOptions === 'date') {
    var dt = new Date();
    return dot.concat(dt.toFormat('YYYYMMDD'))
  } else if (extensionOptions === 'datetime') {
    var dt = new Date();
    return dot.concat(dt.toFormat('YYYYMMDDHH24MISS'))
  } else if (typeof extensionOptions === 'string') {
    extensionOptions = extensionOptions.replace('.', '')
    return dot.concat(extensionOptions)
  }
}

var defaultOptions = {
  extension: 'date'
}

module.exports = function (source, target, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  var called = false

  options = Object.assign({}, defaultOptions, options)

  var extension = getExtension(options.extension)
  target = path.format({
    dir: path.dirname(target),
    base: path.basename(target) + extension
  })

  var rd = fs.createReadStream(source)
  rd.on('error', function (err) {
    done(err)
  })

  var wr = fs.createWriteStream(target)
  wr.on('error', function (err) {
    done(err)
  })
  wr.on('close', function () {
    done();
  })

  rd.pipe(wr);

  function done (err) {
    if (!called) {
      cb(err)
      called = true
    }
  }
}
