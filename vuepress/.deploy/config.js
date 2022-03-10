const PATH = require('path')
const MAP_DIR = {
    ".vuepress": "../.vuepress"
}

module.exports.dir = key => {
    return PATH.resolve(__dirname, MAP_DIR[key])
}