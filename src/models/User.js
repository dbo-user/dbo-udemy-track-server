// mongoose model for User Collection in mongodb
// mongoose automatically create User collection in mongodb
const mongoose = require('mongoose'); // import mongoose library

// create User model structure or layout
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // each email must be unique otherwise error
        required: true // email is mandatory
    },
    password: {
        type: String,
        required: true // pasword is mandatory
    }
}); // end userSchema

// associate User with mongoose library passing in User and userSchema
mongoose.model('User', userSchema);