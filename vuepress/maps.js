
const ASSETS = [
    ['.structure/vuepress/assets/favicon.ico', '.vuepress/public/favicon.ico     ', '网页标签图标']
]
const DATA = [
    ['.structure/vuepress/.data/index.js', '.data/index.js     ', '恢复DATA结构']
]
const THEME = [

]
const FIRST_DEPLOY = [
    ['.structure/vuepress/config.js         ', '.config.js                  ', '全局配置'],
    ['.structure/vuepress/.data             ', '.data                       ', '数据体系'],
    ['.structure/vuepress/.vuepress         ', '.vuepress                   ', '默认主题改造'],
    ['.structure/vuepress/assets/favicon.ico', '.vuepress/public/favicon.ico', '资源:网页标签图标'],
    ['.structure/vuepress/guidance.js       ', '.deploy/guidance.js         ', '更新引导'],
    ['.structure/vuepress/update.js         ', '.deploy/update.js           ', '更新:数据体系/默认主题/静态资源']
]

module.exports = {
    FIRST_DEPLOY,
    ASSETS,
    DATA,
    THEME
}