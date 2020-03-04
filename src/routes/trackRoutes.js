// route managment for tracks manipulation

const express = require('express'); // import express library
const mongoose = require('mongoose'); // import mongoose
const requireAuth = require('../middlewares/requireAuth'); // import requireAuth

const Track = mongoose.model('Track'); // access to Track model and access to Track collection in mongodb
// we can use Track to manipulate the Track collection

// use express to create a router object
// a router is an object that allows us to associate a number of route handlers with it
const router = express.Router();

router.use(requireAuth); // all routes we use will require the user to be signed in

// allow user to retrieve all of their tracks
// GET tracks http request route handler with incoming request object and outgoing response object
router.get('/tracks', async (req, res) => {
    // find all the tracks in mongodb for this user id
    const tracks = await Track.find({ userId: req.user._id });

    res.send(tracks); // send back to the user the array of tracks
}); // end router.get tracks

// POST tracks http request route handler with incoming request object and outgoing response object
router.post('/tracks', async (req, res) => {
    // req.body has name, locations, timestamp and coords because we put it in Tracks.js and Postman
    const { name, locations} = req.body;
    
    // if the name is missing then send error message and exit
    if (!name) {
        return res
            .status(422)
            .send({ error: 'Must provide name from trackRoutes.js tracks post request'});
    } // end if
    // if the location is missing then send error message and exit
    if (!locations) {
        return res
            .status(422)
            .send({ error: 'Must provide locations from trackRoutes.js tracks post request'});
    } // end if

    // name and locations are present 
    // so create a new track
    try { // it is possible that the creation fails or the name or locations are bad
        const track = new Track({ name, locations, userId: req.user._id });
        await track.save(); // save track to mongodb
        res.send(track); // sned track back to user
        console.log('Successful track created from trackRoutes.js');
    } catch (err) {
        return res.status(422).send({ error: 'Unsuccessful track creation attempt from trackRoutes.js tracks post request'});
    }// end catch

}); // end router.post

module.exports = router;