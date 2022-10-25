import 'phaser'

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite
{
    mainScene:Phaser.Scene;

    constructor(scene:Phaser.Scene,x:number,y:number,key:string)
    {
        super(scene,x,y,key)
        scene.add.existing(this); //씬에다가 추가
        scene.physics.add.existing(this); //물리엔젠에다가 연산하도록 추가

        this.mainScene = scene;
    }
}