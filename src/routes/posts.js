const router = require( 'express' ).Router();
const Database = require('../database/Database');
const util = require('../utils/utils')

router.post('/', async (req, res ) => {
    if(!req.body.Zip)
    return res.status( 400 ).send( {msg: 'Please enter a zip code'} );
    else {
        let response = await Database.Posts.getPosts(req.body.Zip);
        if(response == null || response == false){
            return res.status( 404 ).send( {msg: 'No Posts Found'} );
        }
        return res.status(200).send( response );
    }
});

router.post('/create', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    } else if(!req.body.post) {
        return res.status( 400 ).send( {msg: 'Missing post'} );
    } 
    let auth = await util.authUser(req.body.token);
    if(!auth) {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
    let status = await Database.Posts.createPost(
        auth,
        req.body.post.day,
        req.body.post.month,
        req.body.post.year,
        req.body.post.hour,
        req.body.post.minute,
        req.body.post.zip,
        req.body.post.message
    );
    if(!isNumeric(req.body.post.zip)){
        return res.status( 400 ).send( {msg: 'Invalid Zip Code'});
    }
    if(req.body.post.message.length < 10){
        return res.status( 400 ).send( {msg: 'Message must be longer than 10 characters'});
    }
    if(status){
        return res.status( 200 ).send( {msg: 'Created post'});
    } else {
        return res.status( 500 ).send( {msg: 'Server Error'});
    }
});

router.post('/delete', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    } else if(!req.body.postId) {
        return res.status( 400 ).send( {msg: 'Missing postId'} );
    } 
    let auth = util.authUser(req.body.token);
    if(!auth) {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
    let post = await Database.Posts.getPost(req.body.postId);
    if(post == null){
        return res.status( 400 ).send( {msg: 'Post does not exist'} );
    }
    if(post.Username != auth){
        return res.status( 403 ).send( {msg: 'You dont have permission to modify this post'} );
    }
    let status = await Database.Posts.deletePost(req.body.postId);
    if(status){
        return res.status( 200 ).send( {msg: 'Deleted post'});
    } else {
        return res.status( 500 ).send( {msg: 'Server Error'});
    }
});

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

module.exports = router;