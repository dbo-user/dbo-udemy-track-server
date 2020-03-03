const express = require('express'); // import express library

// use express to create a router object
// a router is an object that allows us to associate a number of route handlers with it
const router = express.Router();

// POST http request route handler with incoming request object and outgoing response object
router.post('/signup', (req, res) => {
    console.log(req.body);
    res.send('You made a post request from authRoutes.js')
});

module.exports = router;