import { Socket } from "socket.io-client";
import PlayGameScene from "../Scenes/PlayGameScene";
import { PlayerList,Position,SessionInfo } from "./Protocol";

export const addClientListener = (socket:Socket,scene:PlayGameScene) =>{
    socket.on("position", data =>{
        let pos:Position = data as Position;
        scene.onComplateConnection(pos.x,pos.y);
    });

    socket.on("enter_player",data=>{
        let info = data as SessionInfo;
        scene.createPlayer(info.position.x,info.position.y,200,350,info.id,true);
    })

    //초기 접속시 플레이어 리스트
    socket.on("init_player_list",data=>{
        let playerList = data as PlayerList;
        playerList.list.forEach((p:SessionInfo) =>{
            if(p.id == socket.id) return;
            scene.createPlayer(p.position.x,p.position.y,200,350,p.id,true);
        })
    })
};