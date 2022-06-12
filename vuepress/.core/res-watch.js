const fs = require('fs')
const Path = require('path')
const chokidar = require('chokidar')
const exec = require('child_process').exec

const dirMD = Path.resolve(__dirname, '../md')
chokidar.watch(dirMD)
    .on('error', error => log(`资源监听错误: ${error}`)) 
    .on('change', path => {            
        /md[\\\/]([\w-]+)\.md/.exec(path)
        if (RegExp.$1) { 
            exec(`node ${Path.resolve(__dirname, 'res-build.js')} ${RegExp.$1}`, function(error, stdout, stderr) {
                error && console.log(error)
                stdout && console.log(stdout)
                stderr && console.log(stderr)
            })
        }        
    })

const dirPJ = Path.resolve(__dirname, '../projects')
if (fs.existsSync(dirPJ)) {
    chokidar.watch(dirPJ)
        .on('error', error => log(`项目描述监听错误: ${error}`)) 
        .on('change', path => {            
            /projects[\\\/]([\w-]+\.md)/.exec(path)
            if (RegExp.$1) { 
                exec(`node ${Path.resolve(__dirname, 'projects-build.js')} ${RegExp.$1}`, function(error, stdout, stderr) {
                    error && console.log(error)
                    stdout && console.log(stdout)
                    stderr && console.log(stderr)
                })
            }        
        })
}