const { Router } = require('express')
const router = Router()
const visualScreen = require('../models/visualModel')
const { downs, delate, getPosts, getPostsRnd, updatePost } = require('../controllers/contentContoller')
const { checkUser } = require('../middelware/authMiddelware')



router.get('/posts', getPosts);

router.get('/guide')

router.post('/', checkUser, getPosts, (req, res)=>{
    const posts = req.posts.posts
    const count = req.count.count
    res.render('index', {posts, count})
})

router.post('/add', checkUser, downs)
//delate button
router.post('/delete', delate)
//edit button
router.post('/:id', checkUser, updatePost)


module.exports = router