const exec = require('child_process').exec, Path = require('path'), chokidar = require('chokidar')

    chokidar.watch(Path.resolve(__dirname, './md'))
        .on('error', error => log(`资源监听错误: ${error}`)) 
        .on('change', path => {            
            /md[\\\/]([\w-]+)\.md/.exec(path)
            if (RegExp.$1) { 
                exec(`node ${Path.resolve(__dirname, 'res-create.js')} ${RegExp.$1}`, function(error, stdout, stderr) {
                    error && console.log(error)
                    stdout && console.log(stdout)
                    stderr && console.log(stderr)
                })
            }        
        })