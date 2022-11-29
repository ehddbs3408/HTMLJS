import Phaser from "phaser";
import InitPlayerAnimation from "../Animations/PlayerAnimation";
import { checkAnimationPlay } from "../Core/GameUtil";
import SocketManager from "../Core/SocketManager";
import { DeadInfo, Iceball, SessionInfo } from "../Network/Protocol";
import HealthBar from "./HealthBar";
import PlayerAttack from "./PlayerAttack";
import ProjectilePool from "./Pools/ProjectilePool";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    speed:number;
    jumpPower:number;
    cursorKey:Phaser.Types.Input.Keyboard.CursorKeys;
    body:Phaser.Physics.Arcade.Body;

    isGround:boolean = false;
    maxJumpCount :number = 2;
    currentJumpCount:number = 0;

    //netWork
    isRemoto:boolean = false;
    id:string;

    //Attack
    attack:PlayerAttack;
    hasBeenhit:boolean = false;

    waitingConfirm:number[] = [];

    //HP
    hp:number;
    maxHp:number;
    hpBar: HealthBar;
    isDead:boolean = false;

    tween:Phaser.Tweens.Tween;

    constructor(scene:Phaser.Scene,x:number,y:number,key:string,speed:number,jumpPower:number,id:string,isRemoto:boolean)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.id = id;
        this.isRemoto = isRemoto;

        this.attack = new PlayerAttack(this,1000);

        this.maxHp = this.hp = 10;
        this.hpBar = new HealthBar(this.scene,{x:x - 32 * 0.5,y:y - 38 * 0.5 - 15},new Phaser.Math.Vector2(32,9));
        this.init();

        
    }

    isWaitingForHit(projectileId:number):boolean
    {
        return this.waitingConfirm.find(x=>x == projectileId) != undefined;
    }

    addWating(projectileId:number):void
    {
        this.waitingConfirm.push(projectileId);
    }

    removeWaiting(projectileId:number):void
    {
        let idx = this.waitingConfirm.findIndex(x => x== projectileId);
        if(idx < 0 )return;
        this.waitingConfirm.splice(idx,1);
    }

    init():void
    {
        this.setCollideWorldBounds(true);
        InitPlayerAnimation(this.scene.anims);

        if(this.isRemoto == false)
        {
            this.cursorKey = this.scene.input.keyboard.createCursorKeys();
            this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this);

            this.scene.input.keyboard.on("keydown-Q",this.fireIceball,this);
        }else
        {
            this.body.setAllowGravity(false);
        }  
    }

    fireIceball(data:Iceball):void
    {
        this.attack.attempAttack();
    }

    

    //오른쪽 왼쪽 방향만 dir받는다
    move(direction: number):void
    {
        this.setVelocityX(direction * this.speed);
    }

    jump():void
    {
        this.currentJumpCount++;
        if(this.isGround || this.currentJumpCount <= this.maxJumpCount)
        {
            this.setVelocityY(-this.jumpPower);
        }
    }

    setInfoSync(info:SessionInfo):void
    {
        this.x = info.position.x;
        this.y = info.position.y;
        this.setFlipX(info.filpX);

        if(checkAnimationPlay(this.anims,"throw"))return;

        if(info.isMoving)
        {
            this.play("run",true);
        }else
        {
            this.play("idle",true);
        }
    }

    isMoving():boolean
    {
        return this.body.velocity.length() > 0.1;//이동중
    }
    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time,delta);
        this.hpBar.move(this.x - 32 * 0.5,this.y - 38 * 0.5  -15);
    }

    update(time:number,delta:number):void
    {
        if(this.hasBeenhit || this.isDead) return;
        if(this.cursorKey == undefined) return;

        const {left,right,space} = this.cursorKey;
        const isSpaceJustDown: boolean = Phaser.Input.Keyboard.JustDown(space);
        this.isGround = this.body.onFloor();

        if(left.isDown)
        {
            this.move(-1);
            this.setFlipX(true);
        }
        else if(right.isDown)
        {
            this.move(1);
            this.setFlipX(false);
        }
        else
        {
            this.move(0);
        }

        if(isSpaceJustDown)
        {
            this.jump();
        }

        if(this.isGround && this.body.velocity.y == 0)
            this.currentJumpCount =0;

        if(checkAnimationPlay(this.anims,"throw")) return;

        if(this.isGround == true)
        {
            if(Math.abs(this.body.velocity.x) <= 0.1)
            {
                this.play("idle",true);
            }
            else
            {
                this.play("run",true);
            }
        }
        else
        {
            this.play("jump",true);
        }
    }

    takeHit(damage:number):void
    {
        if(this.hasBeenhit || this.isDead) return;
        this.hasBeenhit = true;

        if(this.tween)
        {
            this.tween.stop();
        }

        this.hp -= damage;

        if(this.hp <= 0)
        {
            this.hp = 0
            this.setDead();
            return;
        }else
        {
            this.tween = this.scene.tweens.add({
                targets:this,
                duration:200,
                repeat: -1,
                alpha:0.2,
                yoyo:true
            });
    
            this.scene.time.delayedCall(1000,()=>{
                this.hasBeenhit = false;
                this.tween.stop(0);
            })
        }
        this.hpBar.setHealth(this.hp/this.maxHp);
        
    }
    bounceOff(dir:Phaser.Math.Vector2):void
    {
        this.setVelocity(-dir.x * 500,-dir.y*500);
    }

    setDead():void
    {
        this.hasBeenhit = false;
        this.setTint(0xff0000);
        this.body.checkCollision.none = true;
        this.isDead = true;
        
        if(this.isRemoto == false)
        {
            this.setVelocity(0,-200);

            this.scene.time.delayedCall(2000,()=>{
                //사버로 플레이어가 사망했다 보내야하거
                this.setActive(false);
                this.setVisible(false);

                let info:DeadInfo = {playerId:this.id};
                SocketManager.Instance.sendData("player_dead",info);
            });
        }
        
    }

    revive():void
    {

    }
}