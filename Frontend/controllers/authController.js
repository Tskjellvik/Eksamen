const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username:'', password:'' };

    //incorrect username
    if (err.message === 'incorrect username'){
        errors.username = 'that username is not registered';
    }

    //incorrect username
    if (err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }

    // duplicate error code
    if (err.code === 11000){
        errors.username = "that username is alreade registered";
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'henrik secret', {
        expiresIn: maxAge
    })
}

module.exports.user_side_posts = async (req, res) =>{
    const username = req.params.username;
    const posts = req.posts.posts;
    const userprofile = await User.findOne({username});


    if(!userprofile){
        res.render('profile', {userprofile:null})
    } else{
        res.render('profile', {userprofile, posts})
    }
}

module.exports.user_homepage = async (req, res) =>{
    const username = req.params.username;
    let bruker;

    if(req.user) {
         bruker = req.user.username
    }
    const posts = req.posts.posts;
    const userprofile = await User.findOne({username});

    let isUser = false;

    if(username === bruker){
        console.log('username og bruker er like');
        isUser = true;
    } else{
        console.log('username og bruker er ikke like');
    }
    if(!userprofile){
        res.render('homeuser', {userprofile:null})
    } else{
        res.render('homeuser', {userprofile, isUser, posts})
    }
}


module.exports.userside_get = (req, res)=>{
    res.render(':username')
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('newCookie', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ user: user._id });
    }
    catch (err){
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body

    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('newCookie', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) =>{
    res.cookie('newCookie', '', { maxAge: 1 });
    res.redirect('/');
} 

