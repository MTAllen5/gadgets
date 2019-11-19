'use strict';

var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

// 从命令行参数获取root目录，默认是当前目录:
var root = path.resolve(process.argv[2] || '.');

var server = http.createServer((request, response) => {
    var pathname = url.parse(request.url).pathname;
    var filepath = path.join(root, pathname);
    var defaultPages = ['index.html', 'default.html'];
    
    function readFile(file) {
        fs.stat(file, function (err, stats) {
            if (err && defaultPages.length <= 0) {
                get404page();
            } else if (stats && stats.isFile()) {
                get200page(file);
            } else {
                readFile(path.join(filepath, defaultPages.shift()));
            }
        });
    }
    
    function get404page() {
        // 出错了或者文件不存在:
        // 发送404响应:
        response.writeHead(404);
        response.end('404 Not Found');
    }
    
    function get200page(filepath) {
        let contentType = {}
        // 没有出错并且文件存在:
        if (/\.css$/.test(filepath)) {
            contentType = {
                'Content-Type': 'text/css'
            }
        }
        // 发送200响应:
        response.writeHead(200, contentType);
        // 将文件流导向response:
        fs.createReadStream(filepath).pipe(response);
    }

    readFile(filepath);
})

server.listen(3000);

console.log('Server is running at http://127.0.0.1:3000/');