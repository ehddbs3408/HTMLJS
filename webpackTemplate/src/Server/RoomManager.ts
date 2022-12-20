import { RoomInfo } from "../Network/Protocol";
import Room from "./Room";
import Session, { SessionTeam } from "./Session";

export enum RoomStatus {
    IDLE = 1,
    RUNNING = 2
}

interface Rooms
{
    [key:number] : Room
}

export default class RoomManager
{
    static Instance : RoomManager;

    nextRoomNo = 1;
    roomMap:Rooms = {};

    createRoom(name:string) : Room
    {
        let newRoom = new Room(name,this.nextRoomNo);
        this.roomMap[this.nextRoomNo] = newRoom;
        this.nextRoomNo++;
        return newRoom;
    }

    leaveRoom(session:Session):void
    {
        let r:Room = session.room as Room;
        r.leaveRoom(session.id);

        session.resetToLobby();
        
        if(r.count == 0)
        {
            delete this.roomMap[r.roomNo];
        }
    }

    getRoom(roomNO:number): Room | null
    {
        if(this.roomMap[roomNO] == undefined)
        {
            return null;
        }else
            return this.roomMap[roomNO];

    }

    //전체 
    getAllRoomInfo():RoomInfo[]
    {
        let list:RoomInfo[] = [];
        for(let key in this.roomMap)
        {
            list.push(this.roomMap[key].serialize());
        }
        return list;
    }
}