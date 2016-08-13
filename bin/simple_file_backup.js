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
  } else if (extensionOptions === 'pure') {
    return ''
  } else if (typeof extensionOptions === 'string') {
    extensionOptions = extensionOptions.replace('.', '')
    return dot.concat(extensionOptions)
  }
}

var defaultOptions = {
  extension: 'date'
}

module.exports = function (source, target, options) {
  options = Object.assign({}, defaultOptions, options)

  var extension = getExtension(options.extension)
  target = path.format({
    dir: target,
    base: path.basename(source) + extension
  })

  var p = new Promise(
    function (resolve, reject) {
      var rd = fs.createReadStream(source)
      rd.on('error', function (err) {
        reject(err)
      })

      var wr = fs.createWriteStream(target)
      wr.on('error', function (err) {
        reject(err)
      })
      wr.on('close', function () {
        resolve()
      })

      rd.pipe(wr);
    }
  )

  return p
}
