const { Router } = require('express')
const router = Router()
const visualScreen = require('../models/visualModel')
const { downs, delate, getPosts, getPostsRnd } = require('../controllers/contentContoller')
const { checkUser } = require('../middelware/authMiddelware')



router.get('/posts', getPosts);

router.post('/', checkUser, getPosts, (req, res)=>{
    const posts = req.posts.posts
    const count = req.count.count
    res.render('index', {posts, count})
})
router.post('/add', checkUser, downs)
router.post('/delete', delate)


// router.get('/random', getPostsRnd)


module.exports = router