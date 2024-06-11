const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) =>{
    const token = req.cookies.newCookie;

    // check json webtoken exists and is verified
    if (token){
        jwt.verify(token, 'henrik secret', (err, decodedToken) =>{
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else{
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

// check current user
const checkUser =  (req, res, next) => {
    const token = req.cookies.newCookie;
    if (token){
        jwt.verify(token, 'henrik secret', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                req.user = {username:user.username};
                next();
            }
        }) 
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };