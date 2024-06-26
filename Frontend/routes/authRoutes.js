const { Router } = require('express');
const authController = require('../controllers/authController')
const {getUsersPosts} = require('../controllers/contentContoller')
const {checkUser} = require('../middelware/authMiddelware')
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);



router.get('/:username', getUsersPosts, authController.user_side_posts)
router.get('/home/:username', getUsersPosts, checkUser,  authController.user_homepage)

module.exports = router;