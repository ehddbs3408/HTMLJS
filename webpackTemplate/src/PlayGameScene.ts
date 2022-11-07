import PlatformSprite from "./GameObject/PlatformSprite";
import PlayerSprite from "./GameObject/PlayerSprite";
import { GameOption } from "./GameOption";
import { PlatformInitOption } from "./GameObject/PlatformSprite";

export class PlayGameScene extends Phaser.Scene {
    player :PlayerSprite;

    background : Phaser.GameObjects.TileSprite;

    leftSprite : Phaser.GameObjects.Sprite;
    rightSprite : Phaser.GameObjects.Sprite;
    middleSprite : Phaser.GameObjects.Sprite;

    platformGroup : Phaser.Physics.Arcade.Group;

    constructor()
    {
        super("PlayGameScene");
    }

    create() {
        this.setBackground();

        this.leftSprite = this.add.sprite(0,0,"leftplatform");
        this.leftSprite.setOrigin(0,0);
        this.leftSprite.setVisible(false);

        this.rightSprite = this.add.sprite(0,0,"rightplatform");
        this.rightSprite.setOrigin(1,0);
        this.rightSprite.setVisible(false);

        this.middleSprite = this.add.sprite(0,0,"platform")
        this.middleSprite.setOrigin(0,0);
        this.middleSprite.setVisible(false);

        this.platformGroup = new Phaser.Physics.Arcade.Group(this.physics.world,this);

        let option:PlatformInitOption = {
            x:200,y:200,width:50
        }

        let p = new PlatformSprite(this,this.platformGroup,
            this.leftSprite,
            this.rightSprite,
            this.middleSprite,
            option);

        this.platformGroup.add(p);

        this.player = new PlayerSprite(this);
        
    }

    handleCollision(body1:Phaser.GameObjects.GameObject,body2:Phaser.GameObjects.GameObject) : void
    {
        let player :PlayerSprite = body1 as PlayerSprite;
        let platform: PlatformSprite = body2 as PlatformSprite;

        console.log("플레이어 착지");
        
    }

    update(time: number, delta:number) 
    {
        this.physics.world.collide(this.player,this.platformGroup,this.handleCollision,undefined,this);
    }

    setBackground() : void
    {
        this.background = this.add.tileSprite(0,0,
            GameOption.gameSize.width / GameOption.pixelScale,
            GameOption.gameSize.height / GameOption.pixelScale,
            'background');
        
        this.background.setOrigin(0,0);
        this.background.scale = GameOption.pixelScale;
    }
}
