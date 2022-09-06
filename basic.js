import {GG,GGM} from "./Person.js";

const canvas = document.querySelector("#gameCavas");
const ctx = canvas.getContext("2d");

let playerX = 10;
let playerY = 10;
let playerColor = "#f00";
let speed = 400;

let keyArr = [];
document.addEventListener("keydown",(e)=>{
    keyArr[e.keyCode] =true;
});

document.addEventListener("keyup",e => {
    keyArr[e.keyCode] =false;
});

function Update()
{   

    if(keyArr[37] == true && playerX > 0)
    {
        playerX -=speed / 60;
    }
    if(keyArr[38] == true && playerY > 0)
    {
        playerY -=speed /60;
    }
    if(keyArr[39] == true&& playerX < canvas.width - 15)
    {
        playerX +=speed /60;
    }
    if(keyArr[40] == true && playerY <canvas.height - 15)
    {
        playerY +=speed /60;
    }



}

function Render()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX,playerY,30,30);
}

let gameLoop = setInterval(()=>{
    Update();
    Render();
},1000/60);




// function GGM(name,age)
// {
//     this.name = name
//     this.age = age;

// }

GGM.prototype.introduce = function()
{
    console.log(`하이 나는${this.name}임 ㅅㄱ 나이는 ${this.age}살임 `);
}

let obj = new GGM("와아아아아",1);
let obj2 = new GGM("박",2);
obj2.introduce = function()
{
    console.log(`qusrud`);
}

let msg = "Hello";
String.prototype.GGM = function()
{
    console.log("안녕 GGm");
}