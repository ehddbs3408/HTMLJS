import { GameObjects, Scene, Scenes } from "phaser";
import { GameOption } from "../GameOption";
import Sprite = Phaser.GameObjects.Sprite

export interface PlatformInitOption
{
    x:number;
    y:number;
    width:number;
}

export default class PlatformSprite extends Phaser.GameObjects.RenderTexture
{
    leftSprite:Sprite;
    rightSprite:Sprite;
    middlesprite:Sprite;

    body : Phaser.Physics.Arcade.Body;
    group : Phaser.Physics.Arcade.Group;

    constructor(scene:Phaser.Scene,group:Phaser.Physics.Arcade.Group ,left:Sprite,rigth:Sprite,middle:Sprite,option:PlatformInitOption)
    {
        super(scene,0,0,1,16);
        this.leftSprite = left;
        this.rightSprite = rigth;
        this.middlesprite = middle;
        
        this.group = group;
        this.group.add(this);
        this.setOrigin(0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.init(option);
    }

    init(option:PlatformInitOption):void
    {
        this.scale = GameOption.pixelScale;
        this.x = option.x;
        this.y = option.y;
        this.setSize(option.width,16);
        this.body.setSize(option.width,16);

        this.middlesprite.displayWidth = option.width;
        this.draw(this.middlesprite,0,0);
        this.draw(this.leftSprite,0,0);
        this.draw(this.rightSprite,option.width,0);
    }
}