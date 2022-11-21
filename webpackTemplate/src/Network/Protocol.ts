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
}

export interface PlayerList
{
    list:SessionInfo[];
}
