import {Player} from "./Player.js";

class App
{
    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D

    private player : Player
    constructor(selector : string)
    {
        this.canvas = document.querySelector(selector) as HTMLCanvasElement;
        this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;

        this.player = new Player(200,200,30,100);

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
    }

    reder() : void
    {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.player.reder(this.ctx);
    }
}

window.addEventListener("load",()=>{
    let app = new App("#gameCanvas");
})