const mysql = require('mysql')
const util = require('util');

function getConnection(){
    return mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT
    });
}

async function init(){
    try{
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query(" \
            CREATE TABLE IF NOT EXISTS `Sessions` ( \
            `Username` VARCHAR(16) NOT NULL, \
            `DateCreated` VARCHAR(100) NOT NULL, \
            `Token` VARCHAR(40) NOT NULL, \
            PRIMARY KEY (`Username`) \
        ); \
        ")
        connection.end();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getSession(token) {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query(`SELECT * FROM Sessions WHERE Token = ?`, [token]);
        connection.end();
        const row = results[0];
        if(row == null) return null;
        else{
            return row;
        }
    } catch (err){
        console.log(err)
        return false;
    }
}

async function createSession(username) {
    try {
        const connection = getConnection();
        connection.connect();
        const token = uuidv4();
        const query = util.promisify(connection.query).bind(connection);
        const results = await query( `REPLACE INTO Sessions (Username,DateCreated,Token) VALUES (?,?,?)`, [username,Date.now(),token] );
        connection.end();
        return token;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function deleteSession(username) {
    try {
        const connection = getConnection();
        connection.connect();
        const results = await connection.query( `DELETE FROM Sessions WHERE Username = ?`,[username]);
        return true;
    } catch (err){
        console.log(err)
        return false;
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

module.exports = { init, getSession, createSession, deleteSession }