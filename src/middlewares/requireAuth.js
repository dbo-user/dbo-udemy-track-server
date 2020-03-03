// Purpose: check for valid json web token and attach user model to request object

const jwt = require('jsonwebtoken'); // import
const mongoose = require('mongoose'); // import
const User = mongoose.model('User'); // access to User model and access to User collection in mongodb
// can use User to manipulate the User collection

// function will authenticate user token
module.exports = (req, res, next) => {
    // check Header from postman for authorization token
    const { authorization } = req.headers;
    // authorization token from postman looks like this 'Bearer eyJhbGciOiJ...'

    // if authorization token is missing
    if (!authorization) { // forbidden status code
        return res.status(401).send({ error: 'You must be logged in. from requireAuth.js'});
        // return will cause an exit
    } // end if

    // token is not missing so extract just the code and drop the word Bearer
    // store just the token code in token
    const token = authorization.replace('Bearer ', '');
    
    // now validate token (secret key is from authRoutes line 23)
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        // error would happen if token did not validate. payload is the user._id
        if (err) {
            return res.status(401).send({ error: 'You must be logged in, possible token issue from requireAuth.js'});
            // return will cause an exit
        } // end if

        // valid token so now extract user._id
        const { userId } = payload;
        // search for userId inside our collection in mongodb
        const user = await User.findById(userId);
        req.user = user; // attach user model to the request object so other request objects will have easy access to the user
        next(); // this middleware is finished so move on the the next middleware if there is one

    }); // end jwt.verify
}