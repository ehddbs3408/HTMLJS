import Phaser from "phaser";
import { GameOption } from "../GameOption";
import PlayGameScene from "../PlayGameScene";

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite
{
    arrowKeys : Phaser.Types.Input.Keyboard.CursorKeys;
    moveDirection : number = 0;

    firstMove:boolean = false;


    constructor(scene:Phaser.Scene)
    {
        let x = GameOption.gameSize.width * 0.5;
        super(scene,x,100,'hero');
        scene.add.existing(this);
        this.scale = GameOption.pixelScale;
        scene.physics.add.existing(this);

        this.initAnimation(this.scene.anims);

        //키보드 바인딩
        this.arrowKeys = this.scene.input.keyboard.createCursorKeys();
        //마우스 바인딩
        this.scene.input.on("pointerdown",this.handlePointer,this);

        this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this);

        //this.setCollideWorldBounds();
        this.body.setOffset(0,15);
        this.body.setSize(20,30);
    }

    handlePointer(e:Phaser.Input.Pointer):void
    {

    }

    update(time:number,delta:number):void
    {
        console.log("업데이트");
        const {left,right} = this.arrowKeys;

        if(left.isDown)
        {
            console.log("left");
            this.setFlipX(true);
            this.anims.play('run',true);
            this.moveDirection = -1;
        }
        else if(right.isDown)
        {
            console.log("right");
            this.setFlipX(false);
            this.anims.play('run',true);
            this.moveDirection = 1;
        }
        else
        {
            this.anims.play('idle',true);
            this.moveDirection = 0;
        }
        if((left.isDown || right.isDown) && this.firstMove == false)
        {
            this.firstMove = true;
            (this.scene as PlayGameScene).startMove();
        }

        this.setVelocityX(this.moveDirection * GameOption.heroSpeed);
        
    }

    initAnimation(anim:Phaser.Animations.AnimationManager) : void
    {
        anim.create({
            key:"idle",
            frames: this.scene.anims.generateFrameNumbers("hero",{start:0,end:10}),
            frameRate:20,
            repeat: -1
        });

        anim.create({
            key:"run",
            frames: anim.generateFrameNumbers("hero_run",{start:0,end:11}),
            frameRate:20,
            repeat: -1
        })
    }
}