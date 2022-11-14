import Http from 'http'
import Express, {Application,Request,response } from 'express'
import Path from 'path'

//익스 프레스 웹 엔진
const app: Application = Express();

app.use(Express.static("public"));

//엔진을 기반인 서버
const server = Http.createServer(app);

server.listen(50000, ()=>{
    console.log(`Server is running on 50000 port`);
});