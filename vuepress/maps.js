const DEPLOY_STRUCTURE = [
    ['.utils/dist                           ', 'docs/.utils                      ', '通用工具'],
    ['.structure/vuepress/config.js         ', '.config.js                       ', '全局配置'],
    ['.structure/vuepress/deploy-data.js    ', '.deploy/deploy-data.js           ', '部署数据体系'],
    ['.structure/vuepress/deploy-theme.js   ', '.deploy/deploy-theme.js          ', '默认主题改造']
]
const DEPLOY_ASSETS = [

]
const DEPLOY_DATA = [

]
const DEPLOY_THEME = [

]
const FIRST_DEPLOY = [
    ['.structure/vuepress/config.js         ', '.config.js                  ', '全局配置'],
    ['.structure/vuepress/.data             ', '.data                       ', '数据体系'],
    ['.structure/vuepress/.vuepress         ', '.vuepress                   ', '默认主题改造'],
    ['.structure/vuepress/assets/favicon.ico', '.vuepress/public/favicon.ico', '资源:网页标签图标'],

    ['.structure/vuepress/update-data.js    ', '.deploy/update-data.js      ', '更新:数据体系'],
    ['.structure/vuepress/update-theme.js   ', '.deploy/update-theme.js     ', '更新:默认主题改造'],
    ['.structure/vuepress/update-assets.js  ', '.deploy/update-assets.js    ', '更新:静态资源更新'],
]


module.exports = {
    FIRST_DEPLOY,
    DEPLOY_STRUCTURE,
    DEPLOY_ASSETS,
    DEPLOY_DATA,
    DEPLOY_THEME
}