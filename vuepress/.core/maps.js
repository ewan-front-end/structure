const INSTALL = [
    {type: 'INSTALL', from: '.structure/vuepress/.core', to: '.abstract/.core', desc: ''},
    {type: 'INSTALL', from: '.structure/vuepress/.vuepress', to: '.vuepress', desc: '默认主题'},
]
const COPY = [
    {type: 'COPY',    from: '.structure/vuepress/config.js', to: '.abstract/config.js', desc: '全局配置'},
    {type: 'COPY',    from: '.structure/vuepress/md', to: '.abstract/md', desc: 'RES'},
    {type: 'COPY',    from: '.structure/vuepress/data.js', to: '.abstract/data.js', desc: '数据体系'},
]
const BACKUPS = [
    {type: 'BACKUPS', from: '.structure/vuepress/public', to: '.vuepress/public', desc: '默认主题静态资源'}
]
const SCRIPTS = [
    {type: 'SCRIPT', key: 'docs:dev', value: 'concurrently \"npm run data:watch\" \"npm run res:watch\" \"vuepress dev docs\"', desc: '开发服务增加热更新'},
    {type: 'SCRIPT', key: 'data:build', value: 'node docs/.abstract/.core/data-build.js', desc: '构建DATA'},
    {type: 'SCRIPT', key: 'data:watch', value: 'node docs/.abstract/.core/data-watch.js', desc: '监听构建DATA'},
    {type: 'SCRIPT', key: 'res:build', value: 'node docs/.abstract/.core/res-build.js', desc: '构建RES'},
    {type: 'SCRIPT', key: 'res:watch', value: 'node docs/.abstract/.core/res-watch.js', desc: '监听构建RES'},
    {type: 'SCRIPT', key: 'projects:deploy', value: 'node docs/.abstract/.core/projects-deploy.js', desc: '部署项目描述'},
    {type: 'SCRIPT', key: 'projects:build', value: 'node docs/.abstract/.core/projects-build.js', desc: '构建项目描述'},
    {type: 'SCRIPT', key: 'deploy', value: 'node docs/.abstract/.core/deploy.js', desc: '重新部署'},
    {type: 'SCRIPT', key: 'undeploy', value: 'node docs/.abstract/.core/undeploy.js', desc: '重新部署'}
]

module.exports = {
    DEPLOY: INSTALL.concat(COPY, BACKUPS),
    INSTALL,
    COPY,
    BACKUPS,
    SCRIPTS
}