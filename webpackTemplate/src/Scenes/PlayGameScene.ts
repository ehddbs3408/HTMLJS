import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";
import { GameOption } from "../GameOption";
import { io, Socket } from "socket.io-client";
import { addClientListener } from "../Network/ClientListener";
import Session from "../Server/Session";

interface RemotePlayerList
{
    [key:string] : Player;
}

export default class PlayGameScene extends Phaser.Scene
{

    player : Player;

    socket:Socket;
    playerName:string;

    remotePlayers:RemotePlayerList ={};

    constructor()
    {
        super({key:"PlayGame"});
        this.socket = io();
        console.log(this.socket.io);
        

    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");

        addClientListener(this.socket,this);

        this.playerName = "ehddbs";
        this.socket.emit("enter",{name:this.playerName});
    }

    onComplateConnection(x:number,y:number):void
    {
        this.createPlayer(x,y,200,350,this.socket.id,false);
        this.cameraSetting();
    }

    //원격으로 진행하는 플레이어랑,내가 조종하는 플레이어
    createPlayer(x:number,y:number, speed:number,jumpPower:number,id:string,isRemote:boolean):void
    {
        if(isRemote)
        {
            this.remotePlayers[id] = new Player(this,x,y,"player",speed,jumpPower,id,isRemote);
        }else
        {
            this.player = new Player(this,x,y,"player",speed,jumpPower,id,isRemote);
            this.physics.add.collider(this.player,MapManager.Instance.collisions);
        }
        
    }
    
    removePlayer(key:string):void
    {
        this.remotePlayers[key].destroy();
        delete this.remotePlayers[key];
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