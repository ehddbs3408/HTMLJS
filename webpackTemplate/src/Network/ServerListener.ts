import { Data } from "phaser";
import { Socket } from "socket.io";
import ServerMapManager from "../Server/ServerMapManager";
import Session from "../Server/Session";
import SessionManager from "../Server/SessionManager";
import { SessionInfo ,PlayerList, Iceball, HitInfo, DeadInfo, ReviveInfo} from "./Protocol";

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

     socket.on("info_sync",data=>{
        let info = data as SessionInfo;

        //해당 세션이 존재하면 인포 셋팅한다.
        SessionManager.Instance.getSession(info.id)?.setInfo(info);
     });

     let projectileId:number = 0;
     socket.on("fire_attampt",data=>{
        let iceball = data as Iceball;
        projectileId++;
        iceball.projectTileId = projectileId;
        
        SessionManager.Instance.broadcast("fire_projectile",iceball,socket.id,false);
     });

     socket.on("hit_report",data =>{
        let hitInfo = data as HitInfo;

        let session = SessionManager.Instance.getSession(hitInfo.playerId);
        if(session == undefined) return;

        let {x,y} = session.position;
        let sLTPos = {x:x - 32,y:y - 38};
        let iLTPos = hitInfo.projectileLTPosition;

        let vecify:boolean = 
        (sLTPos.x < iLTPos.x + 20)
        &&(sLTPos.y < iLTPos.y + 20)
        &&(sLTPos.x+32 + 32*0.5 > iLTPos.x)
        &&(sLTPos.y + 38+38*0.5 > iLTPos.y)

        if(vecify == false) return;

        console.log("zxc");
        
        SessionManager.Instance.broadcast("hit_confirm", hitInfo, socket.id, false);
     });

     socket.on("player_dead",data =>{
         let deadinfo = data as DeadInfo;
         SessionManager.Instance.broadcast("player_dead",deadinfo,socket.id,true);



         setTimeout(()=>{
            let pos = ServerMapManager.Instance.getRandomSpawnPosition();
            session.setPosition(pos);

            let reviveinfo : ReviveInfo = {playerId:deadinfo.playerId,info:session.getSesstionInfo()};
            SessionManager.Instance.broadcast("player_revive",reviveinfo,socket.id,false);
         },1000*5);
     });

     socket.on("disconnect", (reason:string) => {
        SessionManager.Instance.removeSession(socket.id);
        console.log(`${session.name} ( ${socket.id} ) is disconnected`);

        //여기서 접속한 모든 사용자에게 해당 유저가 떠났음을 알려줘야 한다.
        SessionManager.Instance.broadcast("leave_player",session.getSesstionInfo(), socket.id, true);
    });
    

     //클라이언트가 disconnection되며누 
     //leave_player 라는 메세지와 함께 sessioninfo가 넘아오도록 민들어
     //그리고 그걸 받은 클라이언트는 removePlayer를 호출
};