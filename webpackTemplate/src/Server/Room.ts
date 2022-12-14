import SocketManager from "../Core/SocketManager";
import { RoomInfo, UserInfo } from "../Network/Protocol";
import RoomManager, { RoomStatus } from "./RoomManager";
import Session, { SessionStatus } from "./Session";
import SessionManager, { SessionMap } from "./SessionManager";

export default class Room
{
    roomNo: number;
    sessionMap:SessionMap = {};
    status:RoomStatus = RoomStatus.IDLE;

    count:number = 0;
    maxCount:number = 4;
    name:string;

    ownerID:string;

    constructor(name:string,roomNo:number)
    {
        this.roomNo = roomNo;
        this.name = name;
    }

    enterRoom(session:Session):boolean
    {
        if(this.count >= this.maxCount) return false;
        this.sessionMap[session.id] = session;

        session.setRoom(this);

        session.status = SessionStatus.INROOM;
        this.count++;
        return true;
    }

    leaveRoom(socketId:string):void
    {
        this.sessionMap[socketId].resetToLobby();
        this.count--; //한명감소

        let leaveUserinfo = this.sessionMap[socketId].getUserInfo();
        delete this.sessionMap[socketId];
        if(socketId == this.ownerID)
        {
            console.log(`방장이 나갔습니다. ${this.roomNo}를 폐쇄합니다`);
            this.count = 0;
            this.kickAllUser();
        }else
        {
            this.broadcast("leave_user",leaveUserinfo,socketId);
            this.sessionMap[this.ownerID].send("room_ready",{ready:this.checkAllReady()});
        }

    }

    kickAllUser():void
    {
        this.broadcast("leave-owner",{},"none");
        for(let key in this.sessionMap)
        {
            this.sessionMap[key].resetToLobby();
        }
        this.sessionMap = {};
        this.count = 0;
    }

    broadcast(protocol:string,msg:object,sender:string,exceptSender:boolean = false) : void
    {
        for(let key in this.sessionMap)
        {
            if(key == sender && exceptSender) continue;
            this.sessionMap[key].send(protocol,msg);
        }
    }

    //룸안에 있는 모든 유저정보를 가져오는거랑
    getUserList():UserInfo[]
    {
        let list :UserInfo[] = [];
        for(let key in this.sessionMap)
        {
            let s= this.sessionMap[key];
            list.push(s.getUserInfo());
        }
        return list;
    }

    serialize():RoomInfo
    {
        let info:RoomInfo = {
            userList:this.getUserList(),
            Name:this.name,
            userCnt:this.count,
            maxCnt:this.maxCount,
            isPlaying:this.status == RoomStatus.RUNNING,
            no:this.roomNo,
            ownerId:this.ownerID
        };
        return info;
    }

    checkAllReady():boolean
    {
        //양팀 선수가 다 있어야 한다.
        let isReady : boolean = true;
        for(let key in this.sessionMap)
        {
            if(this.sessionMap[key].isReady == false)
            {
                isReady = false;
                break;
            }
        }

        return isReady;
    }

    startGame():void
    {
        this.status = RoomStatus.RUNNING;
        for(let key in this.sessionMap)
        {
            this.sessionMap[key].status = SessionStatus.PLAYING;
            this.sessionMap[key].send("game_start",this.sessionMap[key].getUserInfo());
        }
    }
}