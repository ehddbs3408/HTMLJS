import http ,{Server} from 'http';
import Express, { Application ,Request,Response} from 'express';
import Path from 'path';
import { ConPool } from './DB';
import { ResultSetHeader } from 'mysql2';

const App : Application = Express();

App.use(Express.static("public"));

App.get("/ggm", (req:Request,res:Response)=>{
    console.log(__dirname);
    let filepath:string = Path.join(__dirname,"..","views","index.html");
    res.sendFile(filepath);
    
});

App.get("/record", async (req:Request,res:Response)=>{
    let {username,level} = req.query;
    if(username === undefined || level === undefined)
    {
        res.json({msg:"잘못됨"});
        return;
    }
    let sql = "INSERT INTO score(username,level,time) VALUES (?,?,NOW())";

    try
    {
        let [result,error] : [ResultSetHeader, any] = await ConPool.query(sql,[username,level]);
        if(result.affectedRows == 1)
        {
            res.json({msg:"성공적으로 기록됨"});
        }
        else
        {
            res.json({msg:"DB오류러 기록 못했음"});
        }
    }catch(e)
    {
        console.log(e);
        res.json({msg:"서버오류 발생!!!"});
    }
    res.json({msg:"성공적으로 기록됨"});
    

    
    
});

const httpServer : Server = App.listen(9090, ()=>{
    console.log(`Server is running on 9090 port`);
});