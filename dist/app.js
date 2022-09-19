import { Bullet } from "./Bullet.js";
import { Player } from "./Player.js";
import { Vector2 } from "./Vector2.js";
class App {
    constructor(selector) {
        var _a;
        this.bulletList = [];
        this.canvas = document.querySelector(selector);
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        this.ctx.font = "30px Arial";
        let playerImage = new Image();
        playerImage.src = "./dist/Image/Player.png";
        this.player = new Player(200, 200, 45, 45, 150, playerImage);
        //bullet
        this.bulletImage = new Image();
        this.bulletImage.src = "./dist/Image/CircleBullet.png";
        this.bulletFireTime = 0;
        this.bulletCount = 10;
        this.loop();
    }
    loop() {
        const dt = 1 / 60; //1/60초를 델타타임으로 고정
        setInterval(() => {
            this.update(dt);
            this.reder();
        }, 1000 / 60);
    }
    update(dt) {
        this.player.update(dt);
        this.bulletList.forEach(x => x.update(dt));
        this.bulletFireTime += dt;
        if (this.bulletFireTime > 5) {
            this.FireBullet(dt, this.bulletCount);
        }
        //5초 시간이 지날수록 총알 수가 하나씩 늘어나도록 해주고
        // 화면 횐쪽 상단에 현재 총알수와 현재 시간이 표기되도록
    }
    reder() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText("a", 10, 50);
        this.player.reder(this.ctx);
        this.bulletList.forEach(x => x.reder(this.ctx));
    }
    FireBullet(dt, count) {
        this.bulletFireTime = 0;
        for (let i = 0; i < count; i++) {
            let b;
            let pos = this.getRandomPositionInScreen();
            b = new Bullet(pos.x, pos.y, 15, 15, 100, this.bulletImage);
            let bulletcenter = b.rect.center;
            let playercenter = this.player.rect.center;
            b.setDirection(new Vector2(playercenter.x - bulletcenter.x, playercenter.y - bulletcenter.y).normalize);
            this.bulletList.push(b);
        }
        this.bulletCount++;
    }
    getRandomPositionInScreen() {
        let index = Math.floor(Math.random() * 4);
        let x, y;
        if (index == 0) {
            x = Math.floor(Math.random() * this.canvas.width);
            y = -30;
        }
        else if (index == 1) {
            x = -30;
            y = Math.floor(Math.random() * this.canvas.height);
        }
        else if (index == 2) {
            x = this.canvas.width;
            y = Math.floor(Math.random() * this.canvas.height);
        }
        else {
            x = Math.floor(Math.random() * this.canvas.width);
            y = this.canvas.height;
        }
        return new Vector2(x, y);
    }
}
window.addEventListener("load", () => {
    let app = new App("#gameCanvas");
});
