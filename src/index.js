require('./models/User'); // import User model
const express = require('express'); // import express library
const mongoose = require('mongoose'); // import mongoose library
const bodyParser = require('body-parser'); // helper to parse incoming request body 
const authRoutes = require('./routes/authRoutes'); // import
const requireAuth = require('./middlewares/requireAuth'); // import checks jsonwebtoken

const app = express(); // create app object

app.use(bodyParser.json()); // use bodyParser to parse incoming json formatted data
app.use(authRoutes);

// next few lines to connect to mongo using mongoose
const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0-l8rfw.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true, // might prevent some warning messages
    useCreateIndex: true
});

// text mongoose connection
mongoose.connection.on('connected', () => {
    console.log();
    console.log('GOOD NEWS Connected to mongo instance from index.js');
    console.log();
});
// mongoose connection failed
mongoose.connection.on('error', (err) => {
    console.log('BAD NEWS Error connecting to mongo from index.js', err );
});

// GET http request route handler with incoming request object and outgoing response object
// runs automatically when you go to localhost:3000
// requireAuth is in middlewares folder, it checks for valid jsonwebtoken
app.get('/', requireAuth, (req, res) => {
    res.send(`Successful Root level GET response from index.js: EMAIL is ${req.user.email}`);
});

app.listen(3000, () => {
    console.log();
    console.log('This App is listening on localhost port 3000 from index.js');
    console.log();
});

