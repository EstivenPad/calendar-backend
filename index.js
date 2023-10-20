const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

//Create the express's server
const app = express();

//Database
dbConnection();

//CORS
app.use(cors());

//Public Directory
app.use( express.static('public') );

//Read and Parse of body
app.use( express.json() );

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Listen the requests
app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT} port`);
})