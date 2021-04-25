const express = require("express")
const router = express.Router()
const userController = require('./controllers/UserController')
const postController = require('./controllers/PostController')
const { routes } = require("./app")

//User routes
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// Profile routes
router.get('/profile/:username', userController.ifUserExisted, userController.profilePostsScreen)

//Post routes
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreatePost)
router.post('/create-post', userController.mustBeLoggedIn, postController.create)
router.get('/post/:id', postController.viewSingle)
router.get('/post/:id/edit', userController.mustBeLoggedIn, postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete)

module.exports = router