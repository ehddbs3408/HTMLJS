import Http from 'http'
import Express, {Application,Request,response } from 'express'
import Path from 'path'
import SocketIO ,{ Server,Socket } from 'socket.io';
import { GameOption } from '../GameOption';
import FS from 'fs'
import {Position} from '../Network/protocol';

//익스 프레스 웹 엔진
const app: Application = Express();

app.use(Express.static("public"));

const spawnPoints:Position[] = [];
const mapPath : string = Path.join(__dirname,"..","assets","level1_stage.json");
if(FS.existsSync(mapPath))
{
    let mapjson = FS.readFileSync(mapPath);
    let json = JSON.parse(mapjson.toString());
    
    for(let i = 0;i<json.layers[3].objects.length;i++)
    {
        let obj = json.layers[3].objects[i];
        spawnPoints.push({x:obj.x,y:obj.y});
    }

    console.log(spawnPoints);
}else
{
    console.error("맵파일이 존재 안함!!!");
}


//엔진을 기반인 서버
const server = Http.createServer(app);

const io = new Server(server);

io.on("connection",(socket:Socket) =>{
    console.log(socket.id);

    socket.on("enter",data=>{
       let posIndex:number = Math.floor(Math.random() * spawnPoints.length);
       
       socket.emit("position",spawnPoints[posIndex]);
    });
    
})

server.listen(50000, ()=>{
    console.log(`Server is running on 50000 port`);
});