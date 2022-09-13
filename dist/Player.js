import { GameObject } from "./Gameobject.js";
import { Vector2 } from "./Vector2.js";
export class Player extends GameObject {
    constructor(x, y, width, height, speed, img) {
        super(x, y, width, height);
        this.keyArr = [];
        this.speed = speed;
        this.img = img;
        document.addEventListener("keydown", e => {
            this.keyArr[e.keyCode] = true;
        });
        document.addEventListener("keyup", e => {
            this.keyArr[e.keyCode] = false;
        });
    }
    update(dt) {
        let delta = new Vector2(0, 0);
        if (this.keyArr[37])
            delta.x = -1;
        if (this.keyArr[38])
            delta.y = -1;
        if (this.keyArr[39])
            delta.x = 1;
        if (this.keyArr[40])
            delta.y = 1;
        delta = delta.normalize;
        delta = delta.multiply(this.speed * dt);
        this.translate(delta);
        console.log();
    }
    reder(ctx) {
        //ctx.fillStyle="#ff0000";
        //ctx.fillRect(this.rect.x ,this.rect.y,this.rect.width,this.rect.height);
        let { x, y, width, height } = this.rect; //구조분의 활당
        ctx.drawImage(this.img, x, y, width, height);
    }
}
