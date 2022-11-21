import { Socket } from "socket.io";
import ServerMapManager from "../Server/ServerMapManager";
import Session from "../Server/Session";
import SessionManager from "../Server/SessionManager";
import { SessionInfo ,PlayerList} from "./Protocol";

//서버에서 소켓이 리스닝해야하는 이벤트를 여기서 다 등록
export const addServerListener = (socket:Socket,session:Session) => 
{
    socket.on("enter",data=>{
        let pos =ServerMapManager.Instance.getRandomSpawnPosition();
        socket.emit("position",pos);
        session.setName(data.name);
        session.setPosition(pos);

        //접속한 소켓에는 init_player_list 메세지를 보낼거고
        /*
            세션메니저에있는 map의 모든 정보를 보내준다. 누구에게? 세션에게
        */
       let list = SessionManager.Instance.getAllSessionInfo();
        session.send("init_player_list",{list});

        //다른 모든 소켓에는 enter_player,SessionInfo와 함께보낼게요
        //지금 들어온 소켓은 받지 않는다.
        SessionManager.Instance.broadcast("enter_player",session.getSesstionInfo(),socket.id,true);
     });

     socket.on("disconnect",(reason:string)=>{
        SessionManager.Instance.removeSession(socket.id);
        console.log(`${session.name} (${socket.id}) is disconnects`);
        
        //여기서 접속한 모든 사용자에게 해당 유저가 떠났음을 알려줘야한다.
     });

     socket.on("leave_player",data =>{
        
     });

     //클라이언트가 disconnection되며누 
     //leave_player 라는 메세지와 함께 sessioninfo가 넘아오도록 민들어
     //그리고 그걸 받은 클라이언트는 removePlayer를 호출
};