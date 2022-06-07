
const ASSETS = [
    ['.structure/vuepress/assets/favicon.ico', '.vuepress/public/favicon.ico     ', '网页标签图标']
]
const DATA = [
    ['.structure/vuepress/.data/index.js', '.data/index.js     ', '恢复DATA结构']
]
const THEME = [

]
const DEPLOY_INIT = [
    {type: 'COPY', from: '.structure/vuepress/config.js', to: '.config.js', desc: '全局配置'},
    {type: 'COPY', from: '.structure/vuepress/.data', to: '.data', desc: '数据体系'},
    {type: 'COPY', from: '.structure/vuepress/.vuepress', to: '.vuepress', desc: '默认主题改造'},
    {type: 'COPY', from: '.structure/vuepress/assets/favicon.ico', to: '.vuepress/public/favicon.ico', desc: '资源:网页标签图标'},
    {type: 'COPY', from: '.structure/vuepress/assets/logo.png', to: '.vuepress/public/logo.png', desc: '资源:站点标识'},
    {type: 'COPY', from: '.structure/vuepress/guidance.js', to: '.deploy/guidance.js', desc: '更新引导'},
    {type: 'COPY', from: '.structure/vuepress/update.js', to: '.deploy/update.js', desc: '更新:数据体系/默认主题/静态资源'},
    {type: 'COPY', from: '.structure/vuepress/deploy-projects.js', to: '.deploy/deploy-projects.js', desc: '特种文档：项目描述体系部署'},

    {type: 'SCRIPT', key: 'docs:dev', value: 'concurrently \"npm run data:watch\" \"npm run res:watch\" \"vuepress dev docs\"', desc: ''},
    {type: 'SCRIPT', key: 'update:data', value: 'node docs/.deploy/update.js DATA', desc: '部署数据体系'},
    {type: 'SCRIPT', key: 'update:theme', value: 'node docs/.deploy/update.js THEME', desc: '默认主题改造'},
    {type: 'SCRIPT', key: 'update:assets', value: 'node docs/.deploy/update.js ASSETS', desc: '更新资源'},
    {type: 'SCRIPT', key: 'data:create', value: 'node docs/.data/data-create.js', desc: '创建DATA到MD'},
    {type: 'SCRIPT', key: 'data:watch', value: 'node docs/.data/data-watch.js', desc: '监听数据变化创建DATA到MD'},
    {type: 'SCRIPT', key: 'res:create', value: 'node docs/.data/res-create.js', desc: '创建MD到DOC'},
    {type: 'SCRIPT', key: 'res:watch', value: 'node docs/.data/res-watch.js', desc: '监听MD变化创建MD到DOC'}
]
const UNDEPLOY = [
    {type: 'DEL', file: '.config.js'},
    {type: 'DEL', dir: '.data', exclude: ['data.js', 'md']},
    {type: 'DEL', dir: '.vuepress'},
    {type: 'DEL', file: '.deploy/guidance.js'},
    {type: 'DEL', file: '.deploy/update.js'}
]

module.exports = {
    DEPLOY_INIT,
    UNDEPLOY,
    ASSETS,
    DATA,
    THEME
}