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
            CREATE TABLE IF NOT EXISTS `Posts` ( `PostId` INT NOT NULL AUTO_INCREMENT, `Username` VARCHAR(16) NOT NULL, \
            `Type` VARCHAR(30) NOT NULL, \
            `Subject` VARCHAR(100) NOT NULL, \
            `Body` VARCHAR(500) NOT NULL, \
            PRIMARY KEY (`PostId`) ); \
        ", [])
        connection.end();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getPosts() {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query(`SELECT * FROM Posts`, []);
        connection.end();
        return results;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function getPost(postid) {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query(`SELECT * FROM Posts WHERE PostId = ?`, [postid]);
        connection.end();
        const row = results[0];
        return row;00
    } catch (err){
        console.log(err)
        return false;
    }
}

async function createPost(username,type,subject,body) {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query( `INSERT INTO Posts (Username,Type,Subject,Body) VALUES (?,?,?,?)`, [username,type,subject,body] );
        connection.end();
        return true;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function deletePost(postid) {
    try {
        const connection = getConnection();
        connection.connect();
        const results = await connection.query( `DELETE FROM Posts WHERE PostId = ?`,[postid]);
        return true;
    } catch (err){
        console.log(err)
        return false;
    }
}

module.exports = { init, getPosts, getPost, deletePost, createPost }