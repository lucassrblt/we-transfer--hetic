import mysql from 'mysql2/promise'

const cursor = mysql.createPool({
    host: 'localhost',
    port: 3307,
    database: 'we_transfer',
    user: 'root',
    password: 'root'
});



export default cursor;