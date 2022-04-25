const router = require( 'express' ).Router();
const Database = require('../database/Database');
const util = require('../utils/utils')

router.post('/', async (req, res ) => {
    if(!req.body.Username)
        return res.status(400).send( {msg: 'Missing or invalid username'} );
    else if(!req.body.Password)
        return res.status( 400 ).send( {msg: 'Missing or invalid password'} );
    else {
        let response = await Database.Users.authUser(req.body.Username,util.encrypt(req.body.Username, req.body.Password));
        if(response == null || response.Username == null || response == false){
            return res.status( 400 ).send( {msg: 'Incorrect Username or password'} );
        }
        let sessionToken = await Database.Sessions.createSession(response.Username);
        return res.status(200).send( {token: sessionToken});
    }
});

router.post('/check', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    }
    let auth = await util.authUser(req.body.token);
    if(auth) {
        return res.status( 200 ).send( auth );
    } else {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
});

const schoolCodes = {
    h3bxy: "Example School A",
    l07gk: "Example School B"
}

router.post('/register', async (req, res ) => {
    if(!req.body.FirstName) {
        return res.status( 400 ).send( {msg: 'Missing First Name'} );
    } else if(!req.body.LastName) {
        return res.status( 400 ).send( {msg: 'Missing First Name'} );
    } else if(!req.body.Username) {
        return res.status( 400 ).send( {msg: 'Missing Username'} );
    } else if(!req.body.Password) {
        return res.status( 400 ).send( {msg: 'Missing Password'} );
    } if(!req.body.SchoolCode) {
        return res.status( 400 ).send( {msg: 'Missing School Code'} );
    }
    let check = await Database.Users.getUser(req.body.Username);
    if(check) {
        return res.status( 400 ).send( {msg: 'Username already registered'} );
    } else if(req.body.Username.length > 16) {
        return res.status( 400 ).send( {msg: 'Username cannot be longer than 16 characters'} );
    } else if(req.body.Username.length < 4) {
        return res.status( 400 ).send( {msg: 'Username cannot be shorter than 4 character'} );
    } else if(req.body.Password.length > 60) {
        return res.status( 400 ).send( {msg: 'Password cannot be longer than 60 characters'} );
    } else if(req.body.Password.length < 8) {
        return res.status( 400 ).send( {msg: 'Password cannot be shorter than 8 characters'} );
    } else if(!schoolCodes.hasOwnProperty(req.body.SchoolCode)){
        return res.status( 400 ).send( {msg: 'Invalid School Code'} );
    }
    let user = await Database.Users.createUser(req.body.Username,util.encrypt(req.body.Username, req.body.Password),req.body.FirstName,req.body.LastName,schoolCodes[req.body.SchoolCode])
    if(!user){
        return res.status( 500 ).send( {msg: 'Server Error'} );
    }
    let sessionToken = await Database.Sessions.createSession(req.body.Username);
    return res.status(200).send( {token: sessionToken});
});

module.exports = router;