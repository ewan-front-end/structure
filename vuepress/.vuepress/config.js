const { STATIC_NAV } = require('../.config.js')

module.exports = {
    "title": "标题文本",
    "description": "说明文本",
    "themeConfig": {
        "port": "9000",
        "logo": "/logo.png",
        "nav": STATIC_NAV,
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