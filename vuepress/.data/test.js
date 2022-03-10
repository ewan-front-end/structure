const PATH = require('path')
const { readFile } = require('../.deploy/fs')

let file = readFile(PATH.resolve(__dirname, './md/vue/a.md')) 