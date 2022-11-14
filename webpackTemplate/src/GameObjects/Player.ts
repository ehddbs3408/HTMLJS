import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    speed:number;
    jumpPower:number;
    cursorKey:Phaser.Types.Input.Keyboard.CursorKeys;
    body:Phaser.Physics.Arcade.Body;

    constructor(scene:Phaser.Scene,x:number,y:number,key:string,speed:number,jumpPower:number)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.init();
    }

    init():void
    {
        this.cursorKey = this.scene.input.keyboard.createCursorKeys();
    }
}