const router = require( 'express' ).Router();

const auth = require('./auth')
const posts = require('./posts')
const users = require('./users')

router.use('/auth', auth);
router.use('/posts', posts);
router.use('/users', users);

router.get('/', (req, res ) => {
    return res.status( 200 ).send( {msg: 'UrbanizeEdu API © 2022 Tyler Murphy'} );
});

module.exports = router;