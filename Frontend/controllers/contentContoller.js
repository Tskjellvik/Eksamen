const { default: mongoose } = require('mongoose')
const visualScreen = require('../models/visualModel')

const getContent = async (req, res) =>{
    const contents = await visualScreen.find({})
    res.send(contents)
}

const getPosts = async (req, res, next) =>{
    let id = req.body.id;

    let liMit = 5;
    if(id !== undefined){

        liMit += id;
    } 
    try {
        const posts = await visualScreen.find().sort({_id:-1}).limit(liMit);
        const count = await visualScreen.countDocuments().exec();

        req.count = {count}
        req.posts = {posts}
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
}

const getUsersPosts = async (req, res, next) =>{
    const username = req.params.username;
    try {
        const posts = await visualScreen.find({username}).sort({_id:-1});
        req.posts = {posts}
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
}

const downs = async (req, res) =>{
    const {title, text} = req.body;
    console.log(title, text);
    let username = req.user.username;
    try {
        const make = await visualScreen.create({title, text, username})
        if(make){
            res.redirect(`/home/${username}`)
        }
    } catch(err){
        console.error(err)
    }
}

const delate = async (id) =>{
    console.log(id)
    try {
        const del = await visualScreen.deleteOne({_id: id})
        return del
        
    } catch (error) {
        console.log(error)        
    }
}

//update a post
const updatePost = async (req, res) => {
    const id = req.params.id;
    const text = req.body.text;
    console.log('Running updatPost function!!!', id, text);
    try {
        const post = await visualScreen.findOneAndUpdate({ _id: id }, { text: text }, { new: true });
        if (!post) {
            console.log('No such posts');
            // return { error: 'No such posts' };
        }
    } catch (error) {
        console.error(error);
        // return { error: 'Error updating post' };
    }
    let {username} = res.locals.user;
    console.log(username);
    res.redirect(`/home/${username}`)
 };




 module.exports = {
    downs,
    getContent,
    delate,
    getPosts,
    getUsersPosts,
    updatePost
 };

