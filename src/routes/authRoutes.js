const express = require('express'); // import express library
const mongoose = require('mongoose'); // import mongoose
const jwt = require('jsonwebtoken'); // import

const User = mongoose.model('User'); // access to User model and access to User collection in mongodb
// can use User to manipulate the User collection

// use express to create a router object
// a router is an object that allows us to associate a number of route handlers with it
const router = express.Router();

// POST signup http request route handler with incoming request object and outgoing response object
router.post('/signup', async (req, res) => {
    // req.body has email and password because we put it in Postman
    const { email, password} = req.body;
    
    try {
        // create a new user that has email and password
        const user = new User({ email, password});
        // save new user to mongodb
        await user.save();
        // create json token for new user which is used to identify the user
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


// POST signin http request route handler with incoming request object and outgoing response object
// this is signin not signup so the user should already be on file in mongodb
// signin is like login
router.post('/signin', async (req, res) => {
    // get the user's email and password from the request object body
    const { email, password } = req.body;

    // if the email is missing then send error message and exit
    if (!email) {
        return res.status(422).send({ error: 'Must provide email and password from authRoutes.js signin request'});
    } // end if
    // if the password is missing then send error message and exit
    if (!password) {
        return res.status(422).send({ error: 'Must provide email and password from authRoutes.js signin request'});
    } // end if

    // email and password are present 
    // so search for existing email in mongodb
    const user = await User.findOne({ email });
    // if email not found in mongodb then send error message and exit
    if (!user) {
        return res.status(422).send({ error: 'Email not found, check email from authRoutes.js signin request'});
    } // end if

    // email is okay so compare passwords
    try {// compare the user's password with the password on file in mongodb
        await user.comparePassword(password);
        // passwords match so create token
        // create json token for user which is used to identify the user
        const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY' ); // create unique json web token
        res.send({ token }); // send token back to user
        console.log('Successful sign in from authRoutes.js');

    } catch (err) { // passwords don't match so send error message and exit
        return res.status(422).send({ error: 'Invalid password from authRoutes.js signin request'});
    } // end catch

}); // end post signin

module.exports = router;