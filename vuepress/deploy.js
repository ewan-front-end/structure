const DEPLOY_STRUCTURE = [
    ['.utils/dist                                ', 'docs/.utils                      ', '通用工具'],
    ['.structure/vuepress/.vuepress              ', 'docs/.vuepress                   ', '默认主题改造'],
    ['.structure/vuepress/assets/update-assets.js', '.deploy/update-assets.js         ', '静态资源更新']
]
const DEPLOY_ASSETS = [
    ['.structure/vuepress/assets/favicon.ico     ', 'docs/.vuepress/public/favicon.ico', '网页标签图标']
]
module.exports = {
    DEPLOY_STRUCTURE,
    DEPLOY_ASSETS
}