import Phaser from "phaser";
import GameUtil from "../Core/GameUtil";
import { GameOption } from "../GameOption";
import PlatformSprite, { PlatformInitOption } from "./PlatformSprite";

export default class PlatformGroup extends Phaser.Physics.Arcade.Group
{
    constructor(world:Phaser.Physics.Arcade.World,scene:Phaser.Scene)
    {
        super(world,scene);
    }

    getPlatformInitOption(isFirst:boolean):PlatformInitOption
    {
        let {width,height} = GameOption.gameSize;
        
        let x:number = width * 0.5 + GameUtil.Rand(GameOption.platformXDistacne);
        let y:number = isFirst ? height * 0.4 : 500;
        let pWidth:number = GameUtil.Rand(GameOption.platformRange);

        return {x,y,width:pWidth};
    }

    getLowerYPos() : number
    {
        let pos :number;
        let platforms : PlatformSprite[] = this.getChildren() as PlatformSprite[];

        platforms.forEach(p=>{
            pos = Math.max(pos,p.y);
        })

        return pos;
    }
}