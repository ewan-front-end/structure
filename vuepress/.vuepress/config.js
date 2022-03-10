module.exports = {
    "title": "标题文本",
    "description": "说明文本",
    "themeConfig": {
        "port": "9000",
        "logo": "/logo.png",
        "nav": [
            {
                "text": "首页",
                "link": "/"
            },
            {
                "text": "工具",
                "link": "/tools/"
            },
            {
                "text": "项目",
                "link": "/projects/"
            },
            {
                "text": "场景",
                "link": "/scene"
            }
        ],
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