const exec = require('child_process').exec, Path = require('path'), chokidar = require('chokidar')

let {compare} = require('./index')

chokidar.watch(Path.resolve(__dirname, 'data.js'))
    .on('error', error => log(`data监听错误: ${error}`))
    .on('change', path => {
        compare(arr => {
            if (arr.length) {
                exec(`node ${Path.resolve(__dirname, 'data-create.js')} ${arr.join(' ')}`, function(error, stdout, stderr) {
                    error && console.log(error)
                    stdout && console.log(stdout)
                    stderr && console.log(stderr)
                })
            }
        })
    })
