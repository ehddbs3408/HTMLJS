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
}

export interface HitInfo
{
    projectileId:number;
    playerId:string;
    projectileLTPosition:Position;
}
