import Phaser from "phaser";
import SocketManager from "../Core/SocketManager";
import TooltipHelper from "../Core/TooltipHelper";
import { ChageTeam, CreateRoom, EnterRoom, RoomInfo, SessionInfo, UserInfo } from "../Network/Protocol";
import { SessionTeam } from "../Server/Session";
import SessionManager from "../Server/SessionManager";

export default class LobbyScene extends Phaser.Scene
{
    UIdIV:HTMLElement;
    gameCanvas:HTMLCanvasElement;

    toolTip:TooltipHelper;

    listDiv : HTMLDivElement;
    redTeamDiv:HTMLDivElement;
    blueTeamDiv:HTMLDivElement;
    exitBtn:HTMLButtonElement;

    titleDiv:HTMLDivElement;

    startBtn:HTMLButtonElement;
    constructor()
    {
        super({key:"Lobby"});
        SocketManager.Instance.addLobbyProtocol(this);
        this.UIdIV = document.querySelector("#gameDiv") as HTMLCanvasElement;
        this.gameCanvas = document.querySelector("#theGame > canvas") as HTMLCanvasElement;
        this.startBtn = document.querySelector("#btnStart") as HTMLButtonElement;

        this.titleDiv = this.UIdIV.querySelector(".title-header")as HTMLDivElement

        this.listDiv = this.UIdIV.querySelector(".waiting-row > .user-list") as HTMLDivElement;
        this.redTeamDiv =document.querySelector(".team.red > .list") as HTMLDivElement;
        this.blueTeamDiv = document.querySelector(".team.blue > .list") as HTMLDivElement;



        
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

        this.startBtn = 
        document.querySelector("#btnStart") as HTMLButtonElement;
        this.startBtn.style.visibility = "hidden";
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

            let data : UserInfo = {name,playerId:"",};
            SocketManager.Instance.sendData("login_user",data);
        });
    }

    gotoLobby():void
    {
        const pageContainer =this.UIdIV.querySelector("#pageContainer") as HTMLDivElement;
        pageContainer.style.left = "-100%";
    }

    outToLobby() :void
    {
        this.gotoLobby();
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

        const roomNameDiv = this.UIdIV.querySelector("#roomPage > .title-header .name") as HTMLSpanElement;

        roomNameDiv.innerHTML = roomInfo.Name;

        this.listDiv.innerHTML  ="";
        this.blueTeamDiv.innerHTML = "";
        this.redTeamDiv.innerHTML = "";
        roomInfo.userList.forEach(u => {
            this.createUser(u);
        });
    }

    createUser(u:UserInfo):void
    {
        let userHTML = this.getUserHTML(u.name,u.playerId);
        if(u.team == SessionTeam.NONE)
        {
            this.listDiv.appendChild(userHTML);
        }
        else if(u.team == SessionTeam.RED)
        {
            this.redTeamDiv.appendChild(userHTML);
        }
        else if(u.team == SessionTeam.BLUE)
        {
            this.blueTeamDiv.appendChild(userHTML);
        }

        this.userReady(u);

        userHTML.addEventListener("click",e=>{
            e.stopPropagation();
            if(userHTML.classList.contains("my"))
            {
                SocketManager.Instance.sendData("user_ready",u); //유저인포를 보내준다.
                // let readyDiv = userHTML.querySelector(".ready") as HTMLDivElement;
                // readyDiv.classList.add("on");
            }
        });
    }

    getUserHTML(name:string,playerId:string) : HTMLDivElement
    {
        let div = document.createElement("div");
        div.innerHTML  = `
                <div data-id="${playerId}" class="user ${playerId == SocketManager.Instance.socket.id ? "my" : ""} ">
                    <div class="name">${name}</div>
                    <div class="ready }">Ready</div>
                </div>`;
        
        return div.firstElementChild as HTMLDivElement;
    }

    setUpRoomPage():void
    {
        document.querySelector(".team.red")?.addEventListener("click",e =>{
            const me = this.UIdIV.querySelector(".my") as HTMLDivElement;
            if(me == undefined) return;
            
            
            let requsetTeam:ChageTeam = {
                playerID:SocketManager.Instance.socket.id,
                team:SessionTeam.RED
            };
            
            SocketManager.Instance.sendData("request_team",requsetTeam);
            //redTeamDiv.querySelector(".list")?.appendChild(me);
        });

        document.querySelector(".team.blue")?.addEventListener("click",e=>{
            const me = this.UIdIV.querySelector(".my") as HTMLDivElement;
            if(me == undefined) return;
            

            let requsetTeam:ChageTeam = {
                playerID:SocketManager.Instance.socket.id,
                team:SessionTeam.BLUE
            };

            SocketManager.Instance.sendData("request_team",requsetTeam);
            //this.blueTeamDiv.querySelector(".list")?.appendChild(me);
        });

        document.querySelector("#btnLeave")?.addEventListener("click",e=>{
            SocketManager.Instance.sendData("leave_room",{});
        });

        document.querySelector("#btnStart")?.addEventListener("click",e=>{
            SocketManager.Instance.sendData("start_room",{});
        });
    }

    gameStart(sessionInfo:SessionInfo):void
    {
        this.registry.set("team",sessionInfo);
        this.scene.start("PlayGame");
    }

    addRoomUser(user:UserInfo):void
    {
        this.createUser(user);
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


    removeRoomUser(user:UserInfo):void
    {
        let target = this.UIdIV.querySelector(`[data-id='${user.playerId}']`) as HTMLDivElement;
        target.remove();
    }

    userReady(user:UserInfo):void
    {
        let target =
        this.UIdIV.querySelector(`[data-id='${user.playerId}']`) as HTMLDivElement;
        let readyDiv = target.querySelector(".ready");
        if(user.isReady)
        {
            readyDiv?.classList.add("on");
        }
        else
        {
            readyDiv?.classList.remove("on");
        }
    }

    setRoomReady(ready:boolean):void
    {
        this.startBtn.style.visibility = ready ? "visible" : "hidden";
    }
}