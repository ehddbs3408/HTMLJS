import Phaser from "phaser";
import GameUtil from "./Core/GameUtil";
import EnemySrite from "./EnemySprite";
import PlatformGroup from "./GameObject/PlatformGroup";
import PlatformSprite from "./GameObject/PlatformSprite";
import { GameOption } from "./GameOption";

export default class EnemyGroup extends Phaser.Physics.Arcade.Group
{

    pool : EnemySrite[] = [];
    constructor(world:Phaser.Physics.Arcade.World,scene:Phaser.Scene,pGroup:PlatformGroup)
    {
        super(world,scene);

        scene.physics.add.collider(this,pGroup);

        for(let i = 0;i<15;i++)
        {
            //let e = new EnemySrite(this,p,this.enemyGroup);
        }
    }

    groupToPool(e:EnemySrite):void
    {
        this.remove(e);
        this.pool.push(e);
    }

    poolToGroup(p:PlatformSprite):EnemySrite
    {
        let e = this.pool.shift() as EnemySrite;
        e.platform = p;

        e.x = p.x;
        e.y = e.y - 120;
        e.setVisible(true);
        this.add(e);

        e.body.setAllowGravity(true);
        e.setVelocityX(GameUtil.Rand(GameOption.patrolSpeed) * Phaser.Math.RND.sign());
        e.anims.play("enemy_run",true);
        e.setFlipY(false);

        return e;
    }
}