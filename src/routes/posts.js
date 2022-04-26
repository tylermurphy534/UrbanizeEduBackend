const router = require( 'express' ).Router();
const Database = require('../database/Database');
const util = require('../utils/utils')

router.post('/', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    }
    let auth = await util.authUser(req.body.token);
    if(!auth) {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
    let response = await Database.Posts.getPosts();
    if(response == null || response == false){
        return res.status( 404 ).send( {msg: 'No Posts Found'} );
    }
    return res.status(200).send( response );
});

router.post('/get', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    }
    let auth = await util.authUser(req.body.token);
    if(!auth) {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
    if(!req.body.postId){
        return res.status( 400 ).send( {msg: 'Missing Post Id'} );
    }
    let response = await Database.Posts.getPost(req.body.postId);
    if(response == null || response == false){
        return res.status( 404 ).send( {msg: 'Post Does Not Exist'} );
    }
    response.Comments = JSON.parse(response.Comments);
    return res.status(200).send( response );
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
    if(req.body.post.subject.length < 1){
        return res.status( 400 ).send( {msg: 'Subject must contain text'});
    }
    if(req.body.post.body.length < 1){
        return res.status( 400 ).send( {msg: 'Body must contain text'});
    }
    if(req.body.post.subject.length > 100){
        return res.status( 400 ).send( {msg: 'Subject must not exceed 100 character limit'});
    }
    if(req.body.post.body.length > 500){
        return res.status( 400 ).send( {msg: 'Body must not exceed 500 character limit'});
    }
    let status = await Database.Posts.createPost(
        auth,
        req.body.post.type,
        req.body.post.subject,
        req.body.post.body
    );
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
    let auth = await util.authUser(req.body.token);
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

router.post('/comment', async (req, res ) => {
    if(!req.body.token) {
        return res.status( 400 ).send( {msg: 'Missing token'} );
    } else if(!req.body.postId) {
        return res.status( 400 ).send( {msg: 'Missing postId'} );
    } 
    let auth = await util.authUser(req.body.token);
    if(!auth) {
        return res.status( 401 ).send( {msg: 'Unauthorized'} );
    }
    if(!req.body.name){
        return res.status( 500 ).send( {msg: 'Internal Server Error'} );
    }
    if(!req.body.comment){
        return res.status( 400 ).send( {msg: 'Missing comment'} );
    }
    let post = await Database.Posts.getPost(req.body.postId);
    if(!post){
        return res.status( 400 ).send( {msg: 'Invalid Post'} );
    }
    let comments = post.Comments;
    comments = JSON.parse(comments);
    comments.push(JSON.parse(`{\"${req.body.name}\":\"${req.body.comment}\"}`));
    comments = JSON.stringify(comments);
    let status = Database.Posts.updatePost(parseInt(req.body.postId), post.Username, post.Type, post.Subject, post.Body, comments);
    if(status){
        return res.status( 200 ).send( {msg: 'Added comment'});
    } else {
        return res.status( 500 ).send( {msg: 'Server Error'});
    }
});

module.exports = router;