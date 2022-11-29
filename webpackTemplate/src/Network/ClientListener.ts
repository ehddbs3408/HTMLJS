import { Socket } from "socket.io-client";
import ProjectilePool from "../GameObjects/Pools/ProjectilePool";
import PlayGameScene from "../Scenes/PlayGameScene";
import { DeadInfo, HitInfo, Iceball, PlayerList,Position,ReviveInfo,SessionInfo } from "./Protocol";

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

    socket.on("leave_player", data => {
        let playerList = data as SessionInfo;
        scene.removePlayer(data.id);

    });
    
    socket.on("info_sync",data=>{
        let plist = data as PlayerList;

        plist.list.forEach((p:SessionInfo) => {
            if(p.id == socket.id) return;

            scene.remotePlayers[p.id]?.setInfoSync(p);
            
        })
    });

    socket.on("fire_projectile",data =>{
        let iceball = data as Iceball;
        if(iceball.ownerId == socket.id)
        {
            scene.player.attack.fireProjectTile(iceball);
        }
        else
        {
            scene.remotePlayers[iceball.ownerId].attack.fireProjectTile(iceball);
        }
    });
    
    socket.on("hit_confirm",data=>{
        let hitInfo = data as HitInfo;
        
        ProjectilePool.Instance.searchAndDisable(hitInfo.projectileId,hitInfo.projectileLTPosition);
        

        if(hitInfo.playerId == socket.id)
        {
            scene.player.removeWaiting(hitInfo.projectileId);
            let dir = hitInfo.projectileLTPosition.x - scene.player.x < 0 ? 1 : -1;

            scene.player.bounceOff(new Phaser.Math.Vector2(1,1));
            scene.player.takeHit(hitInfo.damage);
        }
        else
        {
            let target = scene.remotePlayers[hitInfo.playerId];
            if(target == undefined) return;

            target.removeWaiting(hitInfo.projectileId);
            target.takeHit(hitInfo.damage);
        }
    });

    socket.on("player_dead",data => {
        let info = data as DeadInfo;

        scene.remotePlayers[info.playerId].setActive(false);
        scene.remotePlayers[info.playerId].setVisible(false);
    });

    socket.on("player_revive",data=>{
        let reviveInfo = data as ReviveInfo;
        console.log(`${reviveInfo.playerId} 님이 개같이 부활`);
        
    });
};