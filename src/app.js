require('dotenv').config();

const Database = require('./database/Database');

const express = require( 'express' );
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3002;
const routes = require('./routes');
const helmet = require('helmet');

Database.Posts.init();
Database.Users.init();
Database.Sessions.init();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

app.use(cors ())

app.use('/api', routes );

app.listen(PORT, () => console.log( `UrbanizeEdu backend running on Port ${PORT}` ) );