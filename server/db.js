const {Pool}  = require ('pg');
require('dotenv').config()

// const{
//     USERNAME,
//     PASSWORD,
//     HOST,
//     DBPORT,
//     DATABASE
// }=process.env


    const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'todoapp',
    password:'Deep123@#Halder',
    port:5432,
    max:5,
    connectionTimeoutMillis:20000,
    idleTimeoutMillis:20000,
    allowExitOnIdle:false
  });
// const pool=new Pool({
//     user:USERNAME,
//     host:HOST,
//     database:DATABASE,
//     password:PASSWORD,
//     port:DBPORT
// });
module.exports= pool;

// let query=()=>{
//     return 'SELECT * FROM todos;'
// }
// (async()=>{
    
//     const {rows}=await pool. query(query())
//     // res.json(todos.rows)
//     console.log(rows)
//     // client.release(true)
//     await pool.end()
// })()




