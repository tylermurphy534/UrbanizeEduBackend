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
            CREATE TABLE IF NOT EXISTS `Users` ( \
            `Username` VARCHAR(16) NOT NULL, \
            `Password` VARCHAR(60) NOT NULL, \
            `FirstName` VARCHAR(30) NOT NULL, \
            `LastName` VARCHAR(30) NOT NULL, \
            `School` TEXT NOT NULL, \
            PRIMARY KEY (`Username`) ); \
        ")
        connection.end();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getUser(username) {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query(`SELECT * FROM Users WHERE Username = ?`, [username]);
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

async function getUsers() {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query( `SELECT * FROM Users`, [] );
        connection.end();
        return results;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function createUser(username,password,firstname,lastname,school) {
    try {
        const connection = getConnection();
        connection.connect();
        const results = await connection.query( `INSERT INTO Users (Username,Password,FirstName,LastName,School) VALUES (?,?,?,?,?)`, [username,password,firstname,lastname,school] );
        connection.end();
        const data = {};
        data.Username = username;
        data.Password = password;
        data.FirstName = firstname;
        data.LastName = lastname;
        data.School = school;
        return data;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function deleteUser(username) {
    try {
        const connection = getConnection();
        connection.connect();
        const results = await connection.query( `DELETE FROM Users WHERE Username = ?`,[username]);
        return true;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function updateUser(username,password,firstname,lastname,school) {
    try {
        const connection = getConnection();
        connection.connect();
        const results = await connection.query( `REPLACE INTO Users (Username,Password,FirstName,LastName,School) VALUES (?,?,?,?,?)`, [username,password,firstname,lastname,school] );
        connection.end();
        const data = {};
        data.Username = username;
        data.Password = password;
        data.FirstName = firstname;
        data.LastName = lastname;
        data.School = school;
        return data;
    } catch (err){
        console.log(err)
        return false;
    }
}

async function authUser(username,password) {
    try {
        const connection = getConnection();
        const query = util.promisify(connection.query).bind(connection);
        connection.connect();
        const results = await query(`SELECT * FROM Users WHERE Username = ? AND Password = ?`, [username,password]);
        connection.end();
        const row = results[0];
        return row;
    } catch (err){
        console.log(err)
        return false;
    }
}

module.exports = { init, getUser, createUser, deleteUser, updateUser, authUser, getUsers }