
const ASSETS = [
    ['.structure/vuepress/assets/favicon.ico', '.vuepress/public/favicon.ico     ', '网页标签图标']
]
const DATA = [
    ['.structure/vuepress/.data/index.js', '.data/index.js     ', '恢复DATA结构']
]
const THEME = [

]
const DEPLOY_INIT = [
    {type: 'COPY', from: '.structure/vuepress/data', to: '.abstract/data', desc: '数据体系'},
    {type: 'COPY', from: '.structure/vuepress/.vuepress', to: '.vuepress', desc: '默认主题改造'},
    {type: 'COPY', from: '.structure/vuepress/config.js', to: '.abstract/config.js', desc: '全局配置'},
    {type: 'COPY', from: '.structure/vuepress/deploy-projects.js', to: '.abstract/deploy-projects.js', desc: '特种文档：项目描述体系部署'},
    {type: 'COPY', from: '.structure/vuepress/guidance.js', to: '.abstract/guidance.js', desc: '更新引导'},
    {type: 'COPY', from: '.structure/vuepress/update.js', to: '.abstract/update.js', desc: '更新:数据体系/默认主题/静态资源'},

    {type: 'SCRIPT', key: 'docs:dev', value: 'concurrently \"npm run data:watch\" \"npm run res:watch\" \"vuepress dev docs\"', desc: '开发服务增加热更新'},
    {type: 'SCRIPT', key: 'update:data', value: 'node docs/.deploy/update.js DATA', desc: '部署数据体系'},
    {type: 'SCRIPT', key: 'update:theme', value: 'node docs/.abstract/update.js THEME', desc: '默认主题改造'},
    {type: 'SCRIPT', key: 'update:assets', value: 'node docs/.abstract/update.js ASSETS', desc: '更新资源'},
    {type: 'SCRIPT', key: 'data:create', value: 'node docs/.abstract/data-create.js', desc: '创建DATA到MD'},
    {type: 'SCRIPT', key: 'data:watch', value: 'node docs/.abstract/data-watch.js', desc: '监听数据变化创建DATA到MD'},
    {type: 'SCRIPT', key: 'res:create', value: 'node docs/.abstract/res-create.js', desc: '创建MD到DOC'},
    {type: 'SCRIPT', key: 'res:watch', value: 'node docs/.abstract/res-watch.js', desc: '监听MD变化创建MD到DOC'},
    {type: 'SCRIPT', key: 'projects:deploy', value: 'node docs/.abstract/projects-deploy.js', desc: '监听MD变化创建MD到DOC'},
    {type: 'SCRIPT', key: 'projects:create', value: 'node docs/.abstract/projects-create.js ', desc: '监听MD变化创建MD到DOC'}
]
const UNDEPLOY = [
    {type: 'BACKUPS', from: '.abstract/config.js', to: '.backups/config.js', desc: '备份全局配置'},
    {type: 'BACKUPS', from: '.abstract/data/md', to: '.backups/md', desc: '备份RES'},
    {type: 'BACKUPS', from: '.abstract/data/data.js', to: '.backups/data.js', desc: '备份DATA'},
    {type: 'BACKUPS', from: '.vuepress/public', to: '.backups/public', desc: '备份静态资源'},
    {type: 'DEL', file: '.abstract/config.js'},
    {type: 'DEL', file: '.abstract/deploy-projects.js'},
    {type: 'DEL', file: '.abstract/guidance.js'},
    {type: 'DEL', file: '.abstract/update.js'},
    {type: 'DEL', dir: '.abstract/data'},
    {type: 'DEL', dir: '.vuepress'}
]

module.exports = {
    DEPLOY_INIT,
    UNDEPLOY,
    ASSETS,
    DATA,
    THEME
}