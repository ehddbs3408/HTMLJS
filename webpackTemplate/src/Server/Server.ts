import Http from 'http'
import Express, {Application,Request,Response } from 'express'
import Path from 'path'
import SocketIO ,{ Server,Socket } from 'socket.io';
import { GameOption } from '../GameOption';
import Session from './Session';
import { addServerListener } from '../Network/ServerListener';
import ServerMapManager from './ServerMapManager';
import SessionManager from './SessionManager';
import JobTimer from './JobTimer';
import RoomManager from './RoomManager';

//익스 프레스 웹 엔진
const app: Application = Express();

app.use(Express.static("public"));

//맵정보 리딩파트
const mapPath : string = Path.join(__dirname,"..","assets","level1_stage.json");
ServerMapManager.Instance = new ServerMapManager(mapPath);
SessionManager.Instance = new SessionManager();

RoomManager.Instance = new RoomManager();

//debug
RoomManager.Instance.createRoom("더미더미더미더미더미더믿미");
RoomManager.Instance.createRoom("더미더미더미더미더미더믿미2");


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

app.get("/monitor",(req:Request,res:Response)=>{
    let list = SessionManager.Instance.getAllSessionInfo();
    res.json(list);
})

let infoSyncTimer: JobTimer = new JobTimer(50,()=>{
    let list = SessionManager.Instance.getAllSessionInfo();
    SessionManager.Instance.broadcast("info_sync",{list},"none",false);
});

infoSyncTimer.startTimer();