const http = require('http');

const server = http.createServer((req,res)=>{
    console.log(req.url);
    switch(req.url)
    {
        case "/":
            res.end("Hello world!");
            break;
        case "/image":
            res.end("image");
            break;
    }
    
});

server.listen(9090,()=>{
    console.log('서버가 9090 포트에서 구동중입니다.');
});