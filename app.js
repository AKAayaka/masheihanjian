// 引入路由文件
const handleBlogRoute = require('./src/routes/blog');
const querystying = require('querystring');
const { resolve } = require('path');
const { rejects } = require('assert');
const fs = require('fs');


// 处理POST数据
const getPostData = (req) => {
    
    const promise = new Promise((resolve, rejects) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }

        let postData = '';

        // 流数据传输 stream -> chunk
        req.on('data', (chunk) => { // 监听data事件(传输数据) 
            postData += chunk.toString();
        });

        req.on('end', () => { // 监听end事件(此处为data事件结束后触发)
            // console.log('postData:', postData);
            if (!postData) {
                resolve({});
                return;
            }
            resolve(
                JSON.parse(postData)
            );
        });
    });

    return promise;
}

// 写回调函数
const serverHendler = (req, res) => {
    // 指定返回文件格式为 json
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // 获取path
    const url = req.url; // 获取url路由地址
    req.path = url.split('?')[0]; // 获取路径地址

    // 解析query
    req.query = querystying.parse(url.split('?')[1]);

    // 处理 POST 数据
    getPostData(req).then((postData) => {
        
        req.body = postData;

        // 博客路由
        const blogDataPromise =  handleBlogRoute(req, res);

        if (blogDataPromise) {
            blogDataPromise.then((blogData) => {
                res.end(JSON.stringify(blogData));
            })  
            return;
        }
        // 404
        res.writeHead(404, {'Content-Type' : 'text/plain'});
        res.write('404 Not Found');
        res.end();

    });

}

module.exports = serverHendler;