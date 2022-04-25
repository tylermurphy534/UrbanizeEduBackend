const router = require( 'express' ).Router();
const Database = require('../database/Database');
const util = require('../utils/utils')

router.get('/', async (req, res ) => {
    const response = await Database.Users.getUsers();
    if(response == null || response == false){
        return res.status( 500 ).send( {msg: 'Server Error'} );
    }
    for(var key in response){
        delete response[key].Password
    }
    return res.status(200).send( response );
});

router.get('/:username', async (req, res ) => {
    const response = await Database.Users.getUser(req.params.username)
    if(response == null || response == false){
        return res.status( 500 ).send( {msg: 'Server Error'} );
    }
    delete response.Password
    return res.status(200).send( response );
});

router.post('/update', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    }
    let auth = await util.authUser(req.body.token);
    if(!auth) {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
    let user = await Database.Users.getUser(auth);
    let status = await Database.Users.updateUser(user.Username,util.encrypt(auth,req.body.Password),req.body.FirstName,req.body.LastName,user.School);
    if(status){
        return res.status( 200 ).send( {msg: 'Updated Account Information'});
    } else {
        return res.status( 500 ).send( {msg: 'Server Error'});
    }
})

module.exports = router;