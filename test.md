if (req.method === 'POST') { // 判断请求类型是否为POST
        let postData = '';

        // 流数据传输 stream -> chunk
        req.on('data', chunk => { // 监听data事件(传输数据) 
            postData += chunk.toString();
        })

        req.on('end', () => { // 监听end事件(此处为data事件结束后触发)
            console.log('postData:', postData);
            res.end('数据接收完毕');
        })

        console.log('post data content type', req.headers['content-type']);
    }