// mongoose model for User Collection in mongodb
// mongoose automatically create User collection in mongodb
const mongoose = require('mongoose'); // import mongoose library
const bcrypt = require('bcrypt'); // import to salt password

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

// pre save hook, will run before user is saved into mongodb
userSchema.pre('save', function(next) {
    const user = this; // 'this' is the user we are trying to save
    // if the user has not modified their password then don't do anything just return
    if (!user.isModified('password')) {
        return next(); // do nothing and exit
    } // end if

    // Salt is a randomly generated string created by bcrypt
    bcrypt.genSalt(10, (err, salt) => {
        // if an error occurred during genSalt
        if (err) {
            return next(err); // pass the error and exit
        }// end if

        // no error with genSalt
        // Hash is the scrambled password created by bcrypt
        bcrypt.hash(user.password, salt, (err, hash) => {
            // if an error occurred during hash
            if (err) {
                return next(err); // pass the error and exit
            }// end if
            // no error with hash
            // replace original password with the salted hash password
            user.password = hash;
            next();
        }); // end hash

    }); // end bcrypt genSalt

}); // end pre save hook

// automate password checking process, attemptPassword is the password the user is attempting to login with
userSchema.methods.comparePassword = function(attemptPassword) {
    const user = this; // 'this' is the user we are trying to save
    
    // use bcrypt to compare the password the user is attempting login with and the user's password on file in mongodb
    return new Promise((resolve, reject) => {
        bcrypt.compare(attemptPassword, user.password, (err, isMatch) => {
            if (err) { // error with promise
                return reject(err); // reject and pass the error and exit
            }// end if
            // no error with promise
            // but passwords do not match
            if (!isMatch) { // passwords do not match
                return reject(false); // reject and pass the error and exit
            }// end if

            // Success, passwords do match
            resolve(true);

        }); // end bcrypt compare
    }); // end new promise
    
} // end userSchema methods

// associate User with mongoose library passing in User and userSchema
mongoose.model('User', userSchema);