import Phaser from "phaser";
import SocketManager from "../Core/SocketManager";
import TooltipHelper from "../Core/TooltipHelper";
import { CreateRoom, RoomInfo, UserInfo } from "../Network/Protocol";
import SessionManager from "../Server/SessionManager";

export default class LobbyScene extends Phaser.Scene
{
    UIdIV:HTMLElement;
    gameCanvas:HTMLCanvasElement;

    toolTip:TooltipHelper;
    constructor()
    {
        super({key:"Lobby"});
        SocketManager.Instance.addLobbyProtocol(this);
        this.UIdIV = document.querySelector("#gameDiv") as HTMLCanvasElement;
        this.gameCanvas = document.querySelector("#theGame > canvas") as HTMLCanvasElement;

        this.toolTip = new TooltipHelper();

        this.resizeUI(0);

        window.addEventListener("resize",()=> this.resizeUI(20));
        this.setUpLoginPage();
        this.setUpLobbyPage();
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

        nameInput.addEventListener("keydown",e =>{
            this.toolTip.closeTooltip();
        });

        loginBtn.addEventListener("click", e=>{
            
            let name = nameInput.value.trim();
            if(name.length == 0 || name.length > 5)
            {
                this.toolTip.showTooltip(this.UIdIV,nameInput,-40,"아이디는 공백일 수 없고, 5글자 이내여야 합니다.");;
                return;
            }

            const tilte = document.querySelector("#lobbyPage > .info-row > .text-box > .name") as HTMLDivElement;
            tilte.innerHTML = name;

            let data : UserInfo = {name,playerId:""};
            SocketManager.Instance.sendData("login_user",data);
        });
    }

    gotoLobby():void
    {
        const pageContainer =this.UIdIV.querySelector("#pageContainer") as HTMLDivElement;
        
        
        
        pageContainer.style.left = "-100%";
    }

    setUpLobbyPage():void
    {
        const createBtn = document.querySelector("#btnCreate")as HTMLButtonElement;

        createBtn.addEventListener("click",e =>{
            let roomName = prompt("방제목을 입력해주세요");

            if(roomName == null || roomName.trim() == "")
            {
                alert("공백일 수 없어요");
                return;
            }
            let data: CreateRoom = {name:roomName as string,playerId:SocketManager.Instance.socket.id};
            SocketManager.Instance.sendData("create_room",data);
            console.log(roomName);
            
        })

        const refreshBtn = document.querySelector("#btnRefresh") as HTMLButtonElement;
        refreshBtn.addEventListener("click",e=>{
            SocketManager.Instance.sendData("room_list",{});
        })
    }

    drawRoomList(list:RoomInfo[]):void
    {
        const body = this.UIdIV.querySelector("#lobbyPage > .content-body") as HTMLDivElement;
        
        body.innerHTML = "";
        

        list.forEach(info=>{
            let {Name,userCnt,maxCnt,isPlaying,no} = info;
            let roomHTML = this.getRoomHTML(Name,userCnt,maxCnt,isPlaying);
            roomHTML.addEventListener("click",e=>{
                console.log(no);
                
            });
            
            body.appendChild(roomHTML);
        }); 
    }

    getRoomHTML(name:string,userCnt:number,maxCnt:number,isPlaying:boolean):HTMLDivElement
    {
        let div = document.createElement("div");
        div.innerHTML = `
        <div class="room">
            <div class="name">${name}</div>
            <div class="light">
                <div class="circle ${isPlaying == false ? "green" : "red"}"></div>
            </div>
            <div class="count-box">
                <span class="current">${userCnt}</span> /
                <span class="total">${maxCnt}</span>
            </div>
        </div>`;        
        
        return div.firstElementChild as HTMLDivElement;
    }

    goToRoom(roomInfo:RoomInfo):void
    {
        const pageContainer =this.UIdIV.querySelector("#pageContainer") as HTMLDivElement;
        
        pageContainer.style.left = "-200%";

        //여기에 roominfo에있는 유저리스트를 싹다 그려준다.
        console.log(roomInfo);
        
    }
}