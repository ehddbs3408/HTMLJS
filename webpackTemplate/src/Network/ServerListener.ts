import { Data } from "phaser";
import { Socket } from "socket.io";
import Room from "../Server/Room";
import RoomManager from "../Server/RoomManager";
import ServerMapManager from "../Server/ServerMapManager";
import Session, { SessionStatus, SessionTeam } from "../Server/Session";
import SessionManager from "../Server/SessionManager";
import { SessionInfo ,PlayerList, Iceball, HitInfo, DeadInfo, ReviveInfo, UserInfo, CreateRoom, EnterRoom, MsgBox, ChageTeam} from "./Protocol";

//서버에서 소켓이 리스닝해야하는 이벤트를 여기서 다 등록
export const addServerListener = (socket:Socket,session:Session) => 
{
   socket.on("login_user",data =>{
      if(session.status == SessionStatus.CONNECTED)
      {
         let userInfo = data as UserInfo;
         session.setName(userInfo.name);

         session.status = SessionStatus.LOBBY;
         socket.emit("login_confirm",userInfo);
      }
      
   });

   socket.on("create_room",data=>{
      let {name,playerId} = data as CreateRoom

      let room = RoomManager.Instance.createRoom(name);
      room.ownerID = playerId;
      room.enterRoom(session);
      
      socket.emit("enter_room",room.serialize());
      
      
   });

   socket.on("enter_room",data=>{
      let enterRoom = data as EnterRoom;
      
      let room =
      RoomManager.Instance.getRoom(enterRoom.roomNO);
      let msg:MsgBox = {msg:"존재하지 않는 방입니다."};
      if(room == null)
      {
         socket.emit("msgbox",{msg})
      }
      else
      {
         let result = room.enterRoom(session);
         if(result == false)
         {
            msg.msg = "더이상 방에 자리가 없음. 새로고침 하셈";
            socket.emit("msgBox",msg);
         }
         else
         {
            let newUser:UserInfo = session.getUserInfo();
            room.broadcast("new_user",newUser,session.id,true);
            socket.emit("enter_room",room.serialize());
         }
      }
      
   });

   socket.on("room_list",data =>{
      socket.emit("room_list",RoomManager.Instance.getAllRoomInfo());
   });

   socket.on("request_team",data =>{
      let changeTeam = data as ChageTeam;
      
      if(session.status != SessionStatus.INROOM){
         socket.emit("msgbox",{msg:"올바르지 않은 접근"});
         return;
      }

      if(session.isReady)
      {
         socket.emit("msgbox",{msg:"레디 상태에서 안됨"});
      }

      session.team = changeTeam.team;
      session.room?.broadcast("confirm_team",changeTeam,"none");
   });

   socket.on("user_ready",data=>{
      let userinfo = data as UserInfo;
      if(session.team != SessionTeam.NONE)
      {
         session.isReady = !session.isReady;
         userinfo.isReady = session.isReady;
         session.room?.broadcast("user_ready",userinfo,session.id); //재전송.(본인 포함);

         let room = session.room as Room;
         room.sessionMap[room.ownerID].send("room_ready",{ready:room.checkAllReady()});
         
      }else
      {
         socket.emit("msgbox",{msg:"팀을 먼저 선택해야 합니다."});
         return;
      }
   });

   socket.on("leave_room",()=>{
      if(session.room != null)
      {
         RoomManager.Instance.leaveRoom(session);
      }

      socket.emit("goto_lobby");
      socket.emit("room_list",RoomManager.Instance.getAllRoomInfo());
   });

   socket.on("start_room",()=>{
      if(session.room == null || session.room.checkAllReady() == false)
      {
         let msg:MsgBox = {msg:"모든 구성원이 준비되지 않음"};
         socket.emit("msgbox",msg);
         return;
      }

      session.room.startGame();
   });

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

        if(session.room != null)
        {
            session.room.broadcast("leave_player",session.getSesstionInfo(),socket.id,true);
        }
        //여기서 접속한 모든 사용자에게 해당 유저가 떠났음을 알려줘야 한다.
        SessionManager.Instance.broadcast("leave_player",session.getSesstionInfo(), socket.id, true);
    });
    

     //클라이언트가 disconnection되며누 
     //leave_player 라는 메세지와 함께 sessioninfo가 넘아오도록 민들어
     //그리고 그걸 받은 클라이언트는 removePlayer를 호출
};