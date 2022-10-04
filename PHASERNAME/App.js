const width = 750;
const height = 1334;

class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene,x,y,key,speed)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.dir = new Phaser.Math.Vector2(0,0);
        this.checkWorldBouns = true;
    }

    setDirection(dir)
    {
        this.dir = dir;
    }

    resetPosition(pos)
    {
        this.x = pos.x;
        this.y = pos.y;
    }

    move()
    {
        this.setVelocity(this.dir.x * this.speed,this.dir.y * this.speed);
    }
}

class PlayScene extends Phaser.Scene
{
    constructor()
    {
        super("PlayScene");
        this.player = null;
        this.arrowKeys;
        this.playerSpeed = 500;

        this.bullet = null;
        this.bulletGroup = null;
    }

    // Awake
    preload()
    {
        this.load.image("ship","./images/w.png");
        this.load.image("bullet","./images/a.png");
    }
    // Start
    create()
    {
        this.player = this.physics.add.sprite(150,150,"ship");
        this.player.body.setSize(130,130);
        this.bulletGroup = new Phaser.Physics.Arcade.Group(this.physics.world,this);

        for(let i = 0;i<20;i++)
        {
            let pos = this.getRandomPosition();
            let bullet = new Bullet(this,pos.x,pos.y,"Bullet",100);

            let dir = new Phaser.Math.Vector2(this.player.x - pos.x,this.player.y - pos.y);
            bullet.setDirection(dir);
            this.bulletGroup.add(bullet);
        }
        this.arrowKeys = this.input.keyboard.createCursorKeys();
    }
    getRandomPosition()
    {
        let idx = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        switch(idx)
        {
            case 0:
                x = Math.random() * width;
                y=10;
                break;
            case 1:
                x = Math.random() * width;
                y=height -10;
                break;
            case 2:
                x = 10;
                y=Math.random() * height;
                break;
            case 3:
                    x = width -10;
                    y=Math.random() * height;
                break;
        }
        return {x,y};
    }

    update(time,delta)
    {
        this.movePlayer();
        this.physics.world.collide(this.player,this.bulletGroup,this.collisionHandle,null,this);
        
        this.bulletGroup.getChildren().forEach(b =>{
            b.move();

            if(this.cameras.main.worldView.contains(b.x,b.y)==false)
            {
                let pos = this.getRandomPosition();
                let dir = new Phaser.Math.Vector2(this.player.x - pos.x,this.player.y - pos.y);

                b.resetPosition(pos);
                b.setDirection(dir.normalize());
            }
        })
    }

    collisionHandle(player,bullet)
    {
        console.log(player,bullet);
    }

    movePlayer()
    {
        let dir = new Phaser.Math.Vector2(0, 0);
        dir.x = this.arrowKeys.left.isDown ? -1 : this.arrowKeys.right.isDown ? 1:0;
        dir.y = this.arrowKeys.up.isDown ? -1 : this.arrowKeys.down.isDown ? 1:0;

        console.log(dir);
        dir = dir.normalize();

        this.player.setVelocity(dir.x * this.playerSpeed,dir.y * this.playerSpeed)
    }
}

window.addEventListener("load", ()=>{
    let gameConfig ={
        type:Phaser.AUTO,
        backgroundColor:0x0c1445,
        scale:{
            mode:Phaser.Scale.FIT,
            autoCenter:Phaser.Scale.CENTER_BOTH,
            parent:"ggm",
            width:width,
            height:height
        },
        physics: {
            default : "arcade",
            arcade: {
                gravity: {
                    y :0
                },
                debug:true
            }
        },
        scene:PlayScene
    };

    let game = new Phaser.Game(gameConfig);
})
