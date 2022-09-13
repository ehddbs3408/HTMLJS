import { GameObject } from "./Gameobject.js";
import { Rect } from "./Rect.js";
import { Vector2 } from "./Vector2.js";

export class Bullet extends GameObject
{
    img : HTMLImageElement;
    speed : number;
    dir:Vector2;
    lifeTime : number = 0;

    constructor(x : number, y: number,width:number,height:number,speed:number,img:HTMLImageElement)
    {
        super(x,y,width,height);

        this.img = img;
        this.speed = speed;
        this.dir = new Vector2(0,0);
    }
    setDirection(dir : Vector2) : void
    {
        this.dir = dir;
    }

    update(dt : number) : void
    {
        this.lifeTime += dt;
        this.translate(this.dir.multiply(this.speed* dt));
    }

    reder(ctx : CanvasRenderingContext2D) : void
    {
        const {x,y,width,height} = this.rect;
        ctx.drawImage(this.img,x,y,width,height);
    }

    isOutScreen(width : number, height : number) : boolean
    {
        if(this.lifeTime < 1) return false;

        return this.rect.x - this.rect.width < 0||
        this.rect.y - this.rect.height < 0||
        this.rect.x > this.rect.width||
        this.rect.y > this.rect.height
    }

    reset(pos:Vector2,dir:Vector2) : void
    {
        this.lifeTime = 0;
        this.rect.pos = pos;
        this.dir = dir;
    }
}