const express = require("express")
const router = express.Router()
const userController = require('./controllers/UserController')
const postController = require('./controllers/PostController')
const followController = require('./controllers/FollowController')

//User routes
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// Profile routes
router.get('/profile/:username', userController.ifUserExisted, userController.sharedProfileData, userController.profilePostsScreen)
router.get('/profile/:username/followings', userController.ifUserExisted, userController.sharedProfileData, userController.profileFollowingsScreen)
router.get('/profile/:username/followers', userController.ifUserExisted, userController.sharedProfileData, userController.profileFollowersScreen)



//Post routes
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreatePost)
router.post('/create-post', userController.mustBeLoggedIn, postController.create)
router.get('/post/:id', postController.viewSingle)
router.get('/post/:id/edit', userController.mustBeLoggedIn, postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete)
router.post('/search', postController.search)

// follow related routes
router.post('/addFollow/:username', userController.mustBeLoggedIn, followController.addFollow)
router.post('/removeFollow/:username', userController.mustBeLoggedIn, followController.removeFollow)


module.exports = router