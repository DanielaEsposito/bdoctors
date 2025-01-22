const mysql= require('mysql2');
const {DB_HOST, DB_NAME, DB_USER, DB_PASSWORD}= process.env;
const connection= mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME
});

connection.connect((err)=>{
    if (err) throw err;
    console.log('connected to MySql');
    
});

module.exports = connection;