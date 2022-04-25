const Database = require('../database/Database')
const crypto = require('crypto')

async function authUser(token){
    let res = await Database.Sessions.getSession(token);
    if(res == null || res == false){
        return false;
    } else {
        return res.Username;
    }
}

const encrypt = (salt, text) => {
    return crypto.createHash('md5').update(salt + "" + text).digest('hex');
  };

module.exports = { authUser, encrypt }