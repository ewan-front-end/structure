const fs = require('fs')
const Path = require('path')
const { LAYOUT_NAV } = require('../.abstract/.core/data-module.js')
const projectsDir = Path.resolve(__dirname, '../.abstract/projects')
if (fs.existsSync(projectsDir)) LAYOUT_NAV.push({"text": "项目", "link": "/projects/"})

module.exports = {
    "title": "标题文本",
    "description": "说明文本",
    "themeConfig": {
        "port": "9000",
        "logo": "/logo.png",
        "nav": LAYOUT_NAV,
        "sidebarDepth": 2,
        "sidebar": "auto"
    },
    "configureWebpack": {
        "resolve": {
            "alias": {
                "@res": "resources",
                "@res_md": "resources/md"
            }
        }
    },
    "debug": true,
    plugins: [
        require('./vuepress-plugin-super-block'), // path.resolve(__dirname, './vuepress-plugin-super-block/index.js')
    ]
}