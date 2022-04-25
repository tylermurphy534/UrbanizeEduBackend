const Database = require('../database/Database')

async function authUser(token){
    let res = await Database.Sessions.getSession(token);
    if(res == null || res == false){
        return false;
    } else {
        return res.Username;
    }
}

const encrypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  
    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  };

module.exports = { authUser, encrypt }