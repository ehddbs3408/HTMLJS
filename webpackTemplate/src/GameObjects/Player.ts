import Phaser from "phaser";
import InitPlayerAnimation from "../Animations/PlayerAnimation";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    speed:number;
    jumpPower:number;
    cursorKey:Phaser.Types.Input.Keyboard.CursorKeys;
    body:Phaser.Physics.Arcade.Body;

    isGround:boolean = false;
    maxJumpCount :number = 2;
    currentJumpCount:number = 0;

    //netWork
    isRemoto:boolean = false;
    id:string;

    constructor(scene:Phaser.Scene,x:number,y:number,key:string,speed:number,jumpPower:number,id:string,isRemoto:boolean)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.id = id;
        this.isRemoto = isRemoto;
        this.init();

        
    }

    init():void
    {
        this.setCollideWorldBounds(true);
        InitPlayerAnimation(this.scene.anims);

        if(this.isRemoto == false)
        {
            this.cursorKey = this.scene.input.keyboard.createCursorKeys();
            this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this);
        }else
        {
            this.body.setAllowGravity(false);
        }  
    }

    //오른쪽 왼쪽 방향만 dir받는다
    move(direction: number):void
    {
        this.setVelocityX(direction * this.speed);
    }

    jump():void
    {
        this.currentJumpCount++;
        if(this.isGround || this.currentJumpCount <= this.maxJumpCount)
        {
            this.setVelocityY(-this.jumpPower);
        }
    }

    update(time:number,delta:number):void
    {

        if(this.cursorKey == undefined) return;

        const {left,right,space} = this.cursorKey;
        const isSpaceJustDown: boolean = Phaser.Input.Keyboard.JustDown(space);
        this.isGround = this.body.onFloor();

        if(left.isDown)
        {
            this.move(-1);
            this.setFlipX(true);
        }
        else if(right.isDown)
        {
            this.move(1);
            this.setFlipX(false);
        }
        else
        {
            this.move(0);
        }

        if(isSpaceJustDown)
        {
            this.jump();
        }

        if(this.isGround && this.body.velocity.y == 0)
            this.currentJumpCount =0;

        if(this.isGround == true)
        {
            if(Math.abs(this.body.velocity.x) <= 0.1)
            {
                this.play("idle",true);
            }
            else
            {
                this.play("run",true);
            }
        }
        else
        {
            this.play("jump",true);
        }
    }
}