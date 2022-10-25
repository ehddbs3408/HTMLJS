import 'phaser';
import PlayerSprite from './PlayerSprite';
import { GameOption } from './GameOption';
import PlatformSprite from './PlatformSprite';

export class PlayGameScene extends Phaser.Scene {

    player : PlayerSprite;
    gameWidth:number;
    gameHeigth:number;

    sky:Phaser.GameObjects.Sprite;
    eyes:Phaser.GameObjects.Sprite;

    borderGraphics:Phaser.GameObjects.Graphics;
    spritePattern:Phaser.GameObjects.TileSprite;

    platformGroup : Phaser.Physics.Arcade.Group;

    constructor()
    {
        super("PlayGame");
    }

    create() {
        this.gameWidth = this.game.config.width as number;
        this.gameHeigth = this.game.config.height as number;
        this.addSky();
        this.eyes = this.add.sprite(0,0,'eyes');
        this.eyes.setVisible(false);
        
        this.borderGraphics = this.add.graphics();
        this.borderGraphics.setVisible(false);
        
        this.spritePattern = this.add.tileSprite(
            this.gameWidth * 0.5,GameOption.platformheight * 0.5,
            this.gameWidth,GameOption.platformheight * 2,'pattern'); 
        this.spritePattern.setVisible(false);
        this.platformGroup = this.physics.add.group();

        for(let i = 0;i<12;i++)
        {
            this.addPlaform(i ==0);
        }
        this.addPlaform(true);

        this.player = new PlayerSprite(this,this.gameWidth * 0.5,0,'hero');        

    }

    addPlaform(isFirst:boolean):void
    {
        let p : PlatformSprite = new PlatformSprite(this,this.gameWidth * 0.5,this.gameHeigth * GameOption.firstPlatformPosition,this.gameWidth/ 8,GameOption.platformheight);
        p.setPhysics();

        this.platformGroup.add(p);
        p.setPhysics();
        p.drawTexture(this.borderGraphics,this.spritePattern,this.eyes);

        if(isFirst)
        {
            p.setTint(0x00ff00);
            p.canLandOnIt = true;
        }
        else
        {
            this.initPlatform(p);
        }
    }

    addSky():void{
        this.sky = this.add.sprite(0,0,'sky');
        this.sky.displayWidth = this.gameWidth;
        this.sky.displayHeight = this.gameHeigth;
        this.sky.setOrigin(0,0);
    }

    initPlatform(p:PlatformSprite):void
    {
        p.assignedVelocity = this.rand(GameOption.xSpeedRange) * Phaser.Math.RND.sign();
        p.transformTo(this.gameWidth *0.5,
            this.getLowestPlatformY() + this.rand(GameOption.platformYDistanceRange),
            this.rand(GameOption.platformLengthRange),GameOption.platformheight);

        p.drawTexture(this.borderGraphics,this.spritePattern,this.eyes);
    }

    getLowestPlatformY():number
    {
        return Phaser.Math.Between(0,1000);
    }

    rand(arr:number[]):number
    {
        return Phaser.Math.Between(arr[0],arr[1]);
    }

    update(time: number, delta:number) {
        
    }
}