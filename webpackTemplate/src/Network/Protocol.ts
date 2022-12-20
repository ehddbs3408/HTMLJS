import { SessionTeam } from "../Server/Session";

export interface Position 
{
    x:number;
    y:number;
}

export interface SessionInfo
{
    id:string;
    name:string;
    position:Position;
    filpX:boolean;
    isMoving:boolean;
    team?:SessionTeam;
}

export interface PlayerList
{
    list:SessionInfo[];
}

export interface Iceball
{
    ownerId:string;
    projectTileId:number;
    position:Position;
    direction:number;
    velocity:number;
    lifetime:number;
    damage:number;
}

export interface HitInfo
{
    projectileId:number;
    playerId:string;
    projectileLTPosition:Position;
    damage:number;
}

export interface DeadInfo
{
    playerId:string;

}

export interface ReviveInfo
{
    playerId:string;
    info:SessionInfo;
}

export interface UserInfo
{
    name:string;
    playerId:string;
    team?:SessionTeam;
    isReady?:boolean;
}
export interface CreateRoom
{
    name:string;
    playerId:string;
}

export interface EnterRoom
{
    roomNO:number;
}

export interface RoomInfo
{
    userList:UserInfo[];
    no:number;
    Name : string;
    userCnt:number;
    maxCnt:number;
    isPlaying:boolean;
    ownerId:string;
}

export interface MsgBox
{
    msg:string;
}

export interface ChageTeam
{
    playerID: string;
    team:SessionTeam;
}

export interface RoomReady
{
    ready:boolean;
}