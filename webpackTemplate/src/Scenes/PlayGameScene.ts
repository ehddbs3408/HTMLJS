import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";

export default class PlayGameScene extends Phaser.Scene
{

    player : Player;

    constructor()
    {
        super({key:"PlayGame"});
    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");

        this.createPlayer(200,350);
    }

    createPlayer(speed:number,jumpPower:number):void
    {
        this.player = new Player(this,100,200,"player",speed,jumpPower);

        this.physics.add.collider(this.player,MapManager.Instance.collisions);
    }


}