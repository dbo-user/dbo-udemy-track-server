// mongoose model for Track Collection in mongodb
// mongoose automatically creates Track collection in mongodb
const mongoose = require('mongoose'); // import mongoose library

// create pointSchema model structure or layout
// pointSchema is embedded inside trachSchema at locations
const pointSchema = new mongoose.Schema({
    timestamp: Number,
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
}); // end pointSchema

// create Track model structure or layout
const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // reference to the User object stored in mongodb
        ref: 'User' // points userId to an instance of user in the User.js file
    },
    name: {
        type: String,
        default: ''
    },
    locations: [pointSchema] // array of another schema objects
}); // end trackSchema

// associate Track with mongoose library passing in Track and trackSchema
mongoose.model('Track', trackSchema);
