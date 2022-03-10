const {utils, dir} = require('./config.js')
const { mkdirSync } = require('../.utils/fs.js')

mkdirSync(dir('.vuepress'), res => {
    console.log('创建目录：docs/.vuepress', res.message)
})