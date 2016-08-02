'use strict'

const expect = require('chai').expect
const bkup = require('../bin/simple_file_backup')

bkup('C:/Users/johnnytop/Desktop/test/back.txt', 'C:/Users/johnnytop/Desktop/test/sub/back.txt', function (s) {
  console.log(s)
})
