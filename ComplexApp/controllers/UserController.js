const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')
const jwt = require("jsonwebtoken")

exports.apiGetPostsByUsername = async function(req, res) {
    try {
        let authorDoc = await User.findByUsername(req.params.username)
        let posts = await Post.findByAuthorId(authorDoc._id)
        res.json(posts)
    } catch (error) {
        res.json("Sorry, invalid user requested")
    }
}
exports.apiMustBeLoggedIn = function(req, res, next) {
    try {
        req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET)
        next()
    } catch (error) {
        res.json("Sorry, you must provide a valid token")
    }
}

exports.doesUsernameExist = function(req, res) {
    User.findByUsername(req.body.username).then(function() {
        res.json(true)
    }).catch(function() {
        res.json(false)
    })
}

exports.doesEmailExist = async function(req, res) {
    let emailBool = await User.doesEmailExist(req.body.email)
    res.json(emailBool)
}

exports.sharedProfileData = async function(req, res, next) {
    let isVisitorProfile = false
    let isFollowing = false
    if (req.session.user) {
        isVisitorProfile = req.profileUser._id.equals(req.session.user._id)
        isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId)
    }

    req.isVisitorProfile = isVisitorProfile
    req.isFollowing = isFollowing

    // retrieve posts, followers, followings count
    let postCountPromise = Post.countPostsByAuthor(req.profileUser._id)
    let followerCountPromise = Follow.countFollowersById(req.profileUser._id)
    let followingCountPromise = Follow.countFollowingsById(req.profileUser._id)
    let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise, followerCountPromise, followingCountPromise])

    req.postCount = postCount
    req.followerCount = followerCount
    req.followingCount = followingCount

    next()
}

exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash("errors", "You must be logged in to perform that action!")
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.home = async function(req, res) {
    if (req.session.user) {
        // Fetch feed of posts for current user
        let posts = await Post.getFeed(req.session.user._id)
        res.render('home-dashboard', {
            posts: posts
        })
    } else {
        res.render('home-guest', { regErrors: req.flash('regErrors') })
    }
}

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {
            avatar: user.avatar,
            username: user.data.username,
            _id: user.data._id
        }
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch((regErrors) => {
        regErrors.forEach(function(err) {
            req.flash('regErrors', err)
        })

        req.session.save(function() {
            res.redirect('/')
        })
    })

}

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
        req.session.user = {
            avatar: user.avatar,
            username: user.data.username,
            _id: user.data._id
        }
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(function(err) {
        req.flash('errors', err)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.apiLogin = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
        res.json(jwt.sign({_id: user.data._id}, process.env.JWTSECRET, {expiresIn: '7d'}))
    }).catch(function(err) {
        res.json("Sorry.")
    })
}

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/')
    })
}

exports.ifUserExisted = function(req, res, next) {
    User.findByUsername(req.params.username).then(function(userDocument) {
        req.profileUser = userDocument
        next()
    }).catch(function() {
        res.render('404')
    })
}

exports.profilePostsScreen = function(req, res) {
    // ask our post model for posts by a certain author id
    Post.findByAuthorId(req.profileUser._id).then(function(posts) {
        res.render('profile', {
            title: `Profile for ${req.profileUser.username}`,
            currentPage: "posts",
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorProfile: req.isVisitorProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        })
    }).catch(function() {
        res.render('404')
    })
}

exports.profileFollowersScreen = async function(req, res) {
    try {
        let followers = await Follow.getFollowersById(req.profileUser._id)
        res.render('profile-followers', {
            currentPage: "followers",
            followers: followers,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorProfile: req.isVisitorProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        })
    } catch(e) {
        res.render("404")
    }
}

exports.profileFollowingsScreen = async function(req, res) {
    try {
        let followings = await Follow.getFollowingsById(req.profileUser._id)
        res.render('profile-followings', {
            currentPage: "followings",
            followings: followings,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorProfile: req.isVisitorProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        })
    } catch (e) {
        res.render("404")
    }
}
