import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";
import { GameOption } from "../GameOption";
import { io, Socket } from "socket.io-client";

export default class PlayGameScene extends Phaser.Scene
{

    player : Player;

    socket:Socket;

    constructor()
    {
        super({key:"PlayGame"});
        this.socket = io();
        console.log(this.socket.io);
        

    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");
        this.socket.on("position", data =>{
            this.onComplateConnection(data.x,data.y);
        });
        this.socket.emit("enter","ehddbs");
    }

    onComplateConnection(x:number,y:number):void
    {
        this.createPlayer(x,y,200,350);
        this.cameraSetting();
    }

    createPlayer(x:number,y:number, speed:number,jumpPower:number):void
    {
        this.player = new Player(this,x,y,"player",speed,jumpPower);

        this.physics.add.collider(this.player,MapManager.Instance.collisions);
    }

    cameraSetting():void
    {
        const {width,height,mapOffset,cameraZoomFator,bottomOffset} = GameOption;
        this.physics.world.setBounds(0,0,width + mapOffset,height + bottomOffset);
        this.cameras.main.setBounds(0,0,width + mapOffset,height);
        this.cameras.main.setZoom(cameraZoomFator);
        this.cameras.main.startFollow(this.player);
    }
}