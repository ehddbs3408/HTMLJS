import Vector2 = Phaser.Math.Vector2
import { GameOption } from "./GameObject/GameOption";
import GameWall from "./GameObject/GameWall";
import Player from "./GameObject/Player";

export class PlayGameScene extends Phaser.Scene
{
    leftSquare:GameWall;
    rightSquare:GameWall;

    leftWall : GameWall;
    rightWall: GameWall;

    gameWidth:number = 0;
    gameHeigth:number = 0;

    Player: Player;
    constructor()
    {
        super({key:"PlayGame"});
    }

    create() : void
    {
        this.gameWidth = this.game.config.width as number;
        this.gameHeigth = this.game.config.height as number;
        let tinColor = Phaser.Utils.Array.GetRandom(GameOption.bgColor);

        this.cameras.main.setBackgroundColor(tinColor);

        this.placeWalls();

        this.Player = new Player(this,this.gameWidth * 0.5,-400,'square');
        this.add.existing(this.Player);

        this.updateLevel();

        this.input.on("pointerdown",this.grow,this);
        this.input.on("pointerup",this.stop,this);
    }

    grow() : void
    {
        console.log("성장!!!");
        
    }

    stop() : void
    {
        console.log("멈춰!!!");
    }

    placeWalls() : void
    {
        this.leftSquare = new GameWall(this,300,this.gameHeigth,'base', new Vector2(1,1));
        this.add.existing(this.leftSquare);
        this.rightSquare = new GameWall(this,this.gameWidth,this.gameHeigth,"base",new Vector2(0,1));
        this.add.existing(this.rightSquare)

        this.leftWall = new GameWall(this,0,this.gameHeigth - this.leftSquare.height,'top', new Vector2(1,1));
        this.add.existing(this.leftWall);
        this.rightWall = new GameWall(this,this.gameWidth,this.gameHeigth -this.rightSquare.height,"top",new Vector2(0,1));
        this.add.existing(this.rightWall)
    }

    updateLevel() : void
    {
        let holeWidth:number = Phaser.Math.Between(GameOption.holeWidthRange[0],GameOption.holeWidthRange[1]);
        let wallWidth = Phaser.Math.Between(GameOption.wallRange[0],GameOption.wallRange[1]);

        console.log(holeWidth,wallWidth);

        this.leftSquare.tweenTo((this.gameWidth - holeWidth) * 0.5,500);
        this.rightSquare.tweenTo((this.gameWidth + holeWidth) * 0.5,500);
        this.leftWall.tweenTo((this.gameWidth - holeWidth) * 0.5 - wallWidth,500);
        this.rightWall.tweenTo((this.gameWidth + holeWidth) * 0.5 + wallWidth,500);

        this.tweens.add({
            targets:this.Player,
            y:150,
            duration:500,
            ease:'Cubic.easeOut'
        })
    }
}