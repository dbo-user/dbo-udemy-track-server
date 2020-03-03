const express = require('express'); // import express library
const mongoose = require('mongoose'); // import mongoose
const jwt = require('jsonwebtoken'); // import

const User = mongoose.model('User'); // access to User model and access to User collection in mongodb
// can use User to manipulate the User collection

// use express to create a router object
// a router is an object that allows us to associate a number of route handlers with it
const router = express.Router();

// POST http request route handler with incoming request object and outgoing response object
router.post('/signup', async (req, res) => {
    // req.body has email and password because we put it in Postman
    const { email, password} = req.body;
    
    try {
        // create a new user that has email and password
        const user = new User({ email, password});
        // save user to mongodb
        await user.save();
        const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY' ); // create unique json web token
        console.log(`Successful create user in authRoutes.js ${user}`);
        res.send({ token }); // send token back to user
        // catch possible error with email or password
    } catch(err) { // respond with status code and error message
        console.log('ERROR trying to create new user in authRoutes.js');
        return res.status(422).send(err.message) // code for invalid data, email or passowrd
        // return will exit here
    }
});

module.exports = router;