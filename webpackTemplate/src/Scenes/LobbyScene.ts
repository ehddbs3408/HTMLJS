import Phaser from "phaser";
import SocketManager from "../Core/SocketManager";
import TooltipHelper from "../Core/TooltipHelper";
import { ChageTeam, CreateRoom, EnterRoom, RoomInfo, UserInfo } from "../Network/Protocol";
import { SessionTeam } from "../Server/Session";
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
        this.setUpRoomPage();
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
                let enterRoom:EnterRoom = {roomNO:no}
                SocketManager.Instance.sendData("enter_room",enterRoom);
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
        let listDiv =
        this.UIdIV.querySelector(".waiting-row > .user-list") as HTMLDivElement;
        listDiv.innerHTML  ="";
        roomInfo.userList.forEach(u => {
            let userHTML =
            this.getUserHTML(u.name,u.playerId);
            listDiv.appendChild(userHTML);
            userHTML.addEventListener("click",e=>{
                if(userHTML.classList.contains("my"))
                {
                    let readyDiv = userHTML.querySelector(".ready") as HTMLDivElement;
                    readyDiv.classList.add("on");
                }
            });
        });
    }

    getUserHTML(name:string,playerId:string) : HTMLDivElement
    {
        let div = document.createElement("div");
        div.innerHTML  = `
                <div data-id="${playerId}" class="user ${playerId == SocketManager.Instance.socket.id ? "my" : ""} ">
                    <div class="name">${name}</div>
                    <div class="ready">Ready</div>
                </div>`;
        
        return div.firstElementChild as HTMLDivElement;
    }

    setUpRoomPage():void
    {
        const redTeamDiv = document.querySelector(".team.red") as HTMLDivElement;
        const blueTeamDiv = document.querySelector(".team.blue") as HTMLDivElement;

        redTeamDiv.addEventListener("click",e =>{
            const me = this.UIdIV.querySelector(".my") as HTMLDivElement;
            if(me == undefined) return;

            let requsetTeam:ChageTeam = {
                playerID:SocketManager.Instance.socket.id,
                team:SessionTeam.RED
            };
            SocketManager.Instance.sendData("request_team",requsetTeam);
            //redTeamDiv.querySelector(".list")?.appendChild(me);
        });

        blueTeamDiv.addEventListener("click",e=>{
            const me = this.UIdIV.querySelector(".my") as HTMLDivElement;
            if(me == undefined) return;

            let requsetTeam:ChageTeam = {
                playerID:SocketManager.Instance.socket.id,
                team:SessionTeam.BLUE
            };
            SocketManager.Instance.sendData("request_team",requsetTeam);
            blueTeamDiv.querySelector(".list")?.appendChild(me);
        });
    }

    changeTeam(data:ChageTeam):void
    {
        let target =
        this.UIdIV.querySelector(`[data-id='${data.playerID}']`) as HTMLDivElement;

        if(data.team == SessionTeam.BLUE){
            document.querySelector(".team.blue > .list")?.appendChild(target);
        }
        else if(data.team == SessionTeam.RED)
        {
            document.querySelector(".team.red > .list")?.appendChild(target);
        }
    }
}