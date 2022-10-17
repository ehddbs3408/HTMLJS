import MySQL  from 'mysql2/promise';
import {RowDataPacket} from 'mysql2'

const poolOtion : MySQL.PoolOptions = 
{
    host:"gondr.asuscomm.com",
    user:'yy_40101',
    password:'1234',
    database:'yy_40101',
    connectionLimit:10
};

export interface Score extends RowDataPacket
{
    id:number,
    username:string,
    level:number,
    time:string
}

export const ConPool : MySQL.Pool = MySQL.createPool(poolOtion);