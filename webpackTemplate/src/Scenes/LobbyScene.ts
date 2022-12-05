import Phaser from "phaser";
import TooltipHelper from "../Core/TooltipHelper";

export default class LobbyScene extends Phaser.Scene
{
    UIdIV:HTMLElement;
    gameCanvas:HTMLCanvasElement;

    toolTip:TooltipHelper;
    constructor()
    {
        super({key:"Lobby"});
        this.UIdIV = document.querySelector("#gameDiv") as HTMLCanvasElement;
        this.gameCanvas = document.querySelector("#theGame > canvas") as HTMLCanvasElement;

        this.toolTip = new TooltipHelper();

        this.resizeUI(0);

        window.addEventListener("resize",()=> this.resizeUI(20));
        this.setUpLoginPage();


        const container = this.UIdIV.querySelector("#pageContainer") as HTMLDivElement;
        let current:number = 0;
        window.addEventListener("keydown",e =>{
            console.log(current);
            //container.style.left = "-200%";
            if(e.keyCode == 37)
            {
                
                current -=100;  
                
            }else if(e.keyCode == 39)
            {
                current +=100;
                
            }
            if(current < -200) current = -200;
            if(current> 0) current = 0;
            container.style.left = `${current}%`;
        });
        // this.UIdIV.addEventListener("click",()=>{
            
        //     container.style.left = "-100%";
        // });
    }

    create():void
    {
        const sky = this.add.image(0,0,"bg_sky").setOrigin(0,0).setScale(4.5);
    }

    resizeUI(time:number):void
    {
        setTimeout(()=>{
            const {width,height,marginLeft,marginTop} = this.gameCanvas.style;

        this.UIdIV.style.width = width;
        this.UIdIV.style.height = height;
        this.UIdIV.style.marginLeft = marginLeft;
        this.UIdIV.style.marginTop = marginTop;

        let pages = this.UIdIV.querySelectorAll("#pageContainer > div")as NodeListOf<HTMLDivElement>;

        pages.forEach(p => {
            p.style.width = width;
            p.style.height = height;
        })
        },time);
        
    }

    setUpLoginPage():void
    {
        const nameInput = document.querySelector("#nameInput") as HTMLInputElement;
        const loginBtn = document.querySelector("#btnLogin")as HTMLButtonElement;

        loginBtn.addEventListener("click", e=>{
            let name = nameInput.value.trim();
            if(name.length == 0 || name.length > 5)
            {
                this.toolTip.showTooltip(this.UIdIV,nameInput,-40,"아이디는 공백일 수 없고, 5글자 이내여야 합니다.");;
                return;
            }

            
        })
    }
}