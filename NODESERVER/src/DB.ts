import MySQL from 'mysql2/promise';

const poolOtion : MySQL.PoolOptions = 
{
    host:"gondr.asuscomm.com",
    user:'yy_40101',
    password:'1234',
    database:'yy_40101',
    connectionLimit:10
};

export const ConPool : MySQL.Pool = MySQL.createPool(poolOtion);