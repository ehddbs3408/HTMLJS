import { GameObject } from "./Gameobject.js";
import { Vector2 } from "./Vector2.js";

export class Player extends GameObject
{
    img : HTMLImageElement;
    speed : number;
    keyArr:boolean[] = [];

    constructor(x:number,y:number,width : number,height:number,speed:number,img : HTMLImageElement)
    {
        super(x,y,width,height);
        this.speed = speed;
        this.img = img;

        document.addEventListener("keydown", e=>
        {
            this.keyArr[e.keyCode] = true;
        });
        document.addEventListener("keyup", e=>
        {
            this.keyArr[e.keyCode] = false;
        });
    }

    update(dt:number) : void
    {
        let delta : Vector2 = new Vector2(0,0);
        if(this.keyArr[37]) delta.x = -1;
        if(this.keyArr[38]) delta.y = -1;
        if(this.keyArr[39]) delta.x = 1;
        if(this.keyArr[40]) delta.y = 1;
        delta = delta.normalize;
        delta = delta.multiply(this.speed*dt);

        this.translate(delta);
        console.log()
    }

    reder(ctx:CanvasRenderingContext2D) :void
    {
        //ctx.fillStyle="#ff0000";
        //ctx.fillRect(this.rect.x ,this.rect.y,this.rect.width,this.rect.height);

        let {x,y,width,height} = this.rect; //구조분의 활당
        ctx.drawImage(this.img,x,y,width,height);
    }
}