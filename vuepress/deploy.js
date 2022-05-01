const DEPLOY_STRUCTURE = [
    ['.utils/dist                           ', 'docs/.utils                      ', '通用工具   '],
    ['.structure/vuepress/.vuepress         ', 'docs/.vuepress                   ', '默认主题改造'],
    ['.structure/vuepress/update-assets.js  ', '.deploy/update-assets.js         ', '静态资源更新', 'npm run update:assets 更新站点资源'],
    ['.structure/vuepress/deploy-data.js    ', '.deploy/deploy-data.js           ', '部署数据体系', 'npm run deploy:data   部署数据体系'],
    ['.structure/vuepress/config.js         ', '.config.js                       ', '全局配置   '],
]
const DEPLOY_ASSETS = [
    ['.structure/vuepress/assets/favicon.ico', 'docs/.vuepress/public/favicon.ico', '网页标签图标']
]
const DEPLOY_DATA = [
    ['.structure/vuepress/.data             ', 'docs/.data                       ', '数据体系']
]
module.exports = {
    DEPLOY_STRUCTURE,
    DEPLOY_ASSETS,
    DEPLOY_DATA
}