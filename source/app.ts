import { Bullet } from "./Bullet.js";
import {Player} from "./Player.js";
import { Vector2 } from "./Vector2.js";

class App
{
    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D

    private player : Player

    bulletList : Bullet[] = [];
    constructor(selector : string)
    {
        this.canvas = document.querySelector(selector) as HTMLCanvasElement;
        this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;

        let playerImage : HTMLImageElement = new Image();
        playerImage.src = "./dist/Image/Player.png";
        this.player = new Player(200,200,45,45,150,playerImage);

        //bullet
        let bulletImage : HTMLImageElement = new Image();
        bulletImage.src = "./dist/Image/CircleBullet.png";

        for(let i = 0;i<30;i++)
        {
            
            let b:Bullet;
            let pos : Vector2 = this.getRandomPositionInScreen();
            b = new Bullet(pos.x,pos.y,15,15,100,bulletImage);

            let bulletcenter : Vector2 = b.rect.center;
            let playercenter : Vector2 = this.player.rect.center;
            b.setDirection(new Vector2(playercenter.x - bulletcenter.x,playercenter.y - bulletcenter.y).normalize);
            this.bulletList.push(b);
        }
        this.loop();
    }

    loop()
    {
        const dt = 1 /60; //1/60초를 델타타임으로 고정
        setInterval(()=>{
            this.update(dt);
            this.reder();
        },1000/60);

    }

    update(dt:number) : void
    {
        this.player.update(dt);
        this.bulletList.forEach(x => x.update(dt));

        
        //5초 시간이 지날수록 총알 수가 하나씩 늘어나도록 해주고
        // 화면 횐쪽 상단에 현재 총알수와 현재 시간이 표기되도록
    }

    reder() : void
    {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.player.reder(this.ctx);
        this.bulletList.forEach(x => x.reder(this.ctx));
    }
    
    getRandomPositionInScreen() : Vector2
    {
        let index :number =  Math.floor( Math.random() * 4);
        let x : number,y:number;
        if(index==0)
        {
            x = Math.floor( Math.random() * this.canvas.width);
            y = -30;
        }else if(index==1)
        {
            x = -30;
            y = Math.floor( Math.random() * this.canvas.height);
        }else if(index==2)
        {
            x = this.canvas.width;
            y = Math.floor( Math.random() * this.canvas.height);
        }else
        {
            x = Math.floor( Math.random() * this.canvas.width);
            y = this.canvas.height;
        }
        return new Vector2(x,y);
    }
}

window.addEventListener("load",()=>{
    let app = new App("#gameCanvas");
})