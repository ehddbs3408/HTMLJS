import { RoomStatus } from "./RoomManager";
import Session, { SessionStatus } from "./Session";
import { SessionMap } from "./SessionManager";

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

        session.status = SessionStatus.INROOM;
        this.count++;
        return true;
    }

    leaveRoom(socketId:string):void
    {
        
    }
}