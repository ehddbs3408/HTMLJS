import Http from 'http'
import Express, {Application,Request,response } from 'express'
import Path from 'path'
import SocketIO ,{ Server,Socket } from 'socket.io';
import { GameOption } from '../GameOption';
import Session from './Session';
import { addServerListener } from '../Network/ServerListener';
import ServerMapManager from './ServerMapManager';
import SessionManager from './SessionManager';

//익스 프레스 웹 엔진
const app: Application = Express();

app.use(Express.static("public"));

//맵정보 리딩파트
const mapPath : string = Path.join(__dirname,"..","assets","level1_stage.json");
ServerMapManager.Instance = new ServerMapManager(mapPath);
SessionManager.Instance = new SessionManager();

//엔진을 기반인 서버
const server = Http.createServer(app);

const io = new Server(server);

io.on("connection",(socket:Socket) =>{
    console.log(`${socket.id} 님이 로그인`);
    
    let session:Session = new Session(socket);
    SessionManager.Instance.addSession(socket.id,session);

    addServerListener(socket,session);
})

server.listen(50000, ()=>{
    console.log(`Server is running on 50000 port`);
});