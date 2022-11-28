import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { getTimeStamp } from "../Core/GameUtil";
import SocketManager from "../Core/SocketManager";
import { Iceball } from "../Network/Protocol";
import Player from "./Player";
import ProjectilePool from "./Pools/ProjectilePool";

export default class PlayerAttack
{
    lastFireTime:number = 0;
    coolDown:number = 1000;
    damage:number = 5;
    lifeTime:number = 1000;

    player:Player;

    constructor(p:Player,lifeTime:number =1000)
    {
        this.player = p;
        this.lifeTime = lifeTime;
    }

    attempAttack():void
    {
        let now:number = getTimeStamp();
        if(this.coolDown + this.lastFireTime > now) return;

        

        let ownerId = SocketManager.Instance.socket.id;
        let direction = this.player.flipX ? -1 : 1;
        let {x,y} = this.player.getCenter();
        let position = {x:x + direction * 10,y:y}
        let velocity:number = 400;

        let data:Iceball = {ownerId,direction,position,lifetime:this.lifeTime,velocity,projectTileId:0};
        
        SocketManager.Instance.sendData("fire_attampt",data);
    }

    fireProjectTile(data:Iceball) : void
    {
        this.lastFireTime = getTimeStamp();

        let p = ProjectilePool.Instance.getProjectile();
        
        p.fire(data.position,data.lifetime,data.velocity,data.direction,data.ownerId,1);

        this.player.play("throw",true);
    }
}