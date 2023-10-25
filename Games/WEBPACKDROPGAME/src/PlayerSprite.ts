import 'phaser'

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite
{
    mainScene:Phaser.Scene;
    isDie : boolean = false;
    canDestroyPlaform:boolean = false;

    constructor(scene:Phaser.Scene,x:number,y:number,key:string)
    {
        super(scene,x,y,key)
        scene.add.existing(this); //씬에다가 추가
        scene.physics.add.existing(this); //물리엔젠에다가 연산하도록 추가

        this.mainScene = scene;
    }

    die(multiplier:number):void
    {
        this.isDie = true;
        this.setVelocityY(-200);
        this.setVelocityX(200 * multiplier);

        this.mainScene.tweens.add({
            targets:this,
            angle:45 * multiplier,
            duration:500
        })
    }
}