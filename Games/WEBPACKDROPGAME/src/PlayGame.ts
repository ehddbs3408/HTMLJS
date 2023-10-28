import 'phaser';
import PlayerSprite from './PlayerSprite';
import { GameOption } from './GameOption';
import PlatformSprite from './PlatformSprite';
import GameObject =Phaser.GameObjects.GameObject;
import { text } from 'body-parser';

export class PlayGameScene extends Phaser.Scene {

    player : PlayerSprite;
    gameWidth:number;
    gameHeigth:number;

    sky:Phaser.GameObjects.Sprite;
    eyes:Phaser.GameObjects.Sprite;

    borderGraphics:Phaser.GameObjects.Graphics;
    spritePattern:Phaser.GameObjects.TileSprite;

    platformGroup : Phaser.Physics.Arcade.Group;

    actionCam : Phaser.Cameras.Scene2D.Camera;
    paricles : Phaser.GameObjects.Particles.ParticleEmitterManager;
    emitter : Phaser.GameObjects.Particles.ParticleEmitter;

    levelText : Phaser.GameObjects.BitmapText;
    level:number;
    gameOver : boolean;
    gameOverText : Phaser.GameObjects.BitmapText;


    constructor()
    {
        super("PlayGame");
    }

    create() {
        this.level = 0;
        this.gameOver = false;
        
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
        
        this.input.on("pointerdown",this.destroyPlatform,this);

        this.levelText = this.add.bitmapText(this.gameWidth -150,10,'myFont',"0",50);
        this.levelText.setOrigin(1,0);

        this.gameOverText = this.add.bitmapText(this.gameWidth * 0.5,this.gameHeigth * 0.5,'myFont',"Game\n Over",200);
        this.gameOverText.setOrigin(0.5,0.5);
        this.gameOverText.setVisible(false);

        this.createEmitter();//파티클 시스템
        this.setCamera();
    }

    createEmitter() :void
    {
        this.paricles = this.add.particles('particle');
        this.emitter = this.paricles.createEmitter({
            scale:{
                start:1,
                end:0
            },
            speed:{
                min:0,
                max:200
            },
            active:false,
            lifespan:1000,
            quantity:50,
            
        });
    }

    setCamera():void
    {
        this.actionCam = this.cameras.add(0,0,this.gameWidth,this.gameHeigth);
        this.actionCam.ignore([this.sky]);
        this.actionCam.startFollow(this.player,true,
            0,0.5, //xLerp , yLerp
            0, -(this.gameHeigth * 0.5 -this.gameHeigth * GameOption.firstPlatformPosition)); //

        this.cameras.main.ignore([this.player,this.paricles]);
        this.cameras.main.ignore(this.platformGroup);
        if(this.physics.world.debugGraphic != null)
        {
            this.cameras.main.ignore([this.physics.world.debugGraphic]);
        }
    }

    destroyPlatform():void
    {
        console.log("destroy");
        if(this.player.canDestroyPlaform == true&& this.player.isDie == false)
        {
            this.player.canDestroyPlaform = false;

            let closePlatform: Phaser.Physics.Arcade.Body =
                this.physics.closest(this.player) as Phaser.Physics.Arcade.Body;

            let p : PlatformSprite = closePlatform.gameObject as PlatformSprite;

            p.explodeAnDestroy(this.emitter);
            this.initPlatform(p);
        }
        else if(this.gameOver == true)
        {
            this.scene.start("Playgame");
        }
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
        let lowerY : number = 0;

        let platforms : PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        // for(let i = 0;i<platforms.length;i++)
        // {
        //     lowerY = Math.max(lowerY,platforms[i].y);
        // }

        lowerY = Math.max(...platforms.map(x => x.y));
        return lowerY;
    }

    rand(arr:number[]):number
    {
        return Phaser.Math.Between(arr[0],arr[1]);
    }

    update(time: number, delta:number) {
        if(this.player.isDie == false)
        {
            //On
            this.physics.world.collide(this.player,this.platformGroup,this.handleCollision,undefined, this  );
        }

        let pList : PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];

        pList.forEach(p => {
            if(p.y + this.gameHeigth < this.player.y && this.gameOver == true)
            {
                this.gameOver = false
                this.displayGameOverScreen()
                
            }

            
            let a:number = Math.abs(this.gameWidth * 0.5 - p.x);
            let b:number = this.gameWidth * 0.5;
            let distance :number = Math.max(0.2,1 - (a/b) * Math.PI * 0.5);

            p.body.setVelocityX(p.assignedVelocity);

            let helfPlayer :number = this.player.displayWidth * 0.5;
            let pBound:Phaser.Geom.Rectangle = p.getBounds();
            let xVelocity :number = p.body.velocity.x;

            if((xVelocity < 0 && pBound.left < helfPlayer)
            || (xVelocity > 0 && pBound.right > this.gameWidth - helfPlayer))
            {
                p.assignedVelocity *= -1;
            }
        });
    }

    displayGameOverScreen():void
    {
        //GameOverPanel
    }

    reStartGame() :void
    {
        
    }

    handleCollision(body1:GameObject,body2:GameObject):void
    {
        let player:PlayerSprite = body1 as PlayerSprite;
        let platform :PlatformSprite = body2 as PlatformSprite;

        if(platform.isHeroOnIt == false)
        {
            //1.플레이어가 왼쪽에 닿았는가?
            if(player.x < platform.getBounds().left)
            {
                this.fallAndDie(-1);
                return;
            }
            //2. 플레이어가 오른쪽에 닿았는가?
            if(player.x > platform.getBounds().right)
            {
                this.fallAndDie(1);
                return;
            }
            //3.이 플랫품이 찾지 가능한가?
            if(platform.canLandOnIt == false)
            {
                this.fallAndDie(1);
                return;
            }
            console.log("충돌");
            
            platform.isHeroOnIt = true;
            platform.assignedVelocity = 0;
            player.canDestroyPlaform = true;
            
            this.paintSafePlatforms();
            //this.add
        }
    }

    paintSafePlatforms():void
    {
        let first : PlatformSprite = this.getHighestPlatform(0) as PlatformSprite;
        first.setTint(0xff000);
        let second : PlatformSprite = this.getHighestPlatform(first.y) as PlatformSprite;
        second.setTint(0x00ff00);
        second.canLandOnIt = true;
    }

    getHighestPlatform(bound:number):PlatformSprite | undefined
    {
        let pList :PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        
        let yList:number[] = pList.filter(x => x.y > bound).map(x => x.y);
        let minY = Math.min(...yList);
        let highPlat : PlatformSprite = pList.find(x=>x.y == minY) as PlatformSprite;
        
        return highPlat;
    }

    fallAndDie(multiplier : number):void
    {
        this.player.die(multiplier);

        this.gameOver = true;
        this.time.addEvent({
            delay:800,
            callback:()=>this.actionCam.stopFollow()
        })
    }
}