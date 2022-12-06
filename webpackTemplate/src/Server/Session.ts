import {Socket} from 'socket.io';
import { Position, SessionInfo } from '../Network/Protocol';

export enum SessionStatus
{
    CONNECTED = 1,
    LOBBY = 2,
    INROOM = 3,
    READYINROOM = 4,
    PLAYING = 5
}
export enum SessionTeam
{
    RED = 1,
    BLUE = 2,
    NONE = 3
}
export default class Session
{
    socket:Socket;
    name:string;
    position:Position = {x:0,y:0}
    id:string;
    filpX:boolean = false;
    isMoving:boolean = false;

    status:SessionStatus = SessionStatus.CONNECTED;
    team:SessionTeam = SessionTeam.RED;

    constructor(socket:Socket)
    {
        this.socket = socket;
        this.id = socket.id;
    }
    setPosition(position:Position):void
    {
        let {x,y} = position;
        this.position.x = x;
        this.position.y = y;
    }

    setName(value:string):void
    {
        this.name = value;
    }

    send(protocol:string,data:any):void
    {
        this.socket.emit(protocol,data);
    }

    getSesstionInfo():SessionInfo
    {
        return {id:this.id,name:this.name,position:this.position,filpX:this.filpX,isMoving:this.isMoving};
    }

    setInfo(info:SessionInfo):void
    {
        this.setPosition(info.position);
        this.filpX = info.filpX;
        this.isMoving = info.isMoving;
        //그외의 정보를 여기서 셋팅
    }
}