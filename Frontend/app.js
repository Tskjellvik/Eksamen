const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoutes')
const visualRouter = require('./routes/visualRouter')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const { requireAuth, checkUser } = require("./middelware/authMiddelware");
const {delate, getPosts} = require('./controllers/contentContoller')
const visualScreen = require('./models/visualModel')
const dbURL = "mongodb://10.12.10.160:27017/?directConnection=true&appName=mongosh+2.1.5"

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

// routes

app.get('*', checkUser);
app.get('/', getPosts, async (req, res) => {
    const posts = req.posts.posts
    const count = req.count.count
    res.render('index', {posts, count})
});


app.post('/home/:username', checkUser, async(req, res)=>{
    const id = req.body.id;
    let username = req.user.username;
    const deleted = await delate(id)
    if(deleted.acknowledged){
        res.status(200).redirect(`/home/${username}`)
    }

})



app.use(authRoutes)
app.use(visualRouter)

mongoose.connect(dbURL, {})
    .then((result) => {
        app.listen(6969)
        console.log("Connected to Mongo, and listening on 6969")
        })
    .catch((err) => console.log(err));



