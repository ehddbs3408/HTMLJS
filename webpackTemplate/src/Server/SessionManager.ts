import { SessionInfo } from "../Network/Protocol";
import Session from "./Session";

interface SessionMap
{
    [key:string] :Session
}

export default class SessionManager
{
    static Instance : SessionManager;
    map :SessionMap = {};

    constructor()
    {

    }

    getSession(key:string):Session | undefined
    {
        return this.map[key];
    }

    addSession(key:string,session:Session):void
    {
        this.map[key] = session;
    }

    removeSession(key:string):void
    {
        delete this.map[key];
    }

    broadcast(protocol:string,msgJson:Object,senderKey:string,exceptSender:boolean = false):void
    {
        for(let key in this.map)
        {
            if(key == senderKey && exceptSender == true) continue;
            this.map[key].send(protocol,msgJson);
        }
    }

    getAllSessionInfo():SessionInfo[]
    {
        let list:SessionInfo[] = [];
        //이부분을
        for(let key in this.map)
        {
            list.push(this.map[key].getSesstionInfo());
        }

        return list;
    }
}