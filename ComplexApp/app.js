const express = require("express")
const session = require("express-session")
const MongoDbStore = require('connect-mongo')(session)
const flash = require("connect-flash")
const markdown = require("marked")
const csrf = require("csurf") 
const sanitizeHTML = require("sanitize-html")
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/api', require('./router-api'))

let sessionOptions = session({
    secret: "JS is so cool",
    store: new MongoDbStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())

app.use(function(req, res, next) {
    //make our markdown function available within ejs template
    res.locals.filterUserHTML = function(content) {
        return markdown(sanitizeHTML(markdown(content), {allowedTags: ['p', 'br', 'ul', 'li', 'h1', 'h2', 'bold', 'italic'], allowedAttributes: {}}))
    }
    // make all errors and success flash message availabel from all user
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

    // make current user id available on the req object
    if (req.session.user) {
        req.visitorId = req.session.user._id
    } else {
        req.visitorId = 0
    }

    // make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

const router = require('./router')

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(csrf())

app.use(function (req, res, next) {
    var token = req.csrfToken()
    res.cookie('XSRF-TOKEN', token)
    res.locals.csrfToken = token
    next()
})

app.use('/', router)

app.use(function(err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            req.flash("errors", "Cross site request forgery detected.")
            req.session.save(() => res.redirect("/"))
        } else {
            res.render("404")
        }
    }
})

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket) {
    if (socket.request.session.user) {
        let user = socket.request.session.user

        socket.emit('welcome', {username: user.username, avatar: user.avatar})

        socket.on('chatMessageFromBrowser', function(data) {
            socket.broadcast.emit('chatMessageFromServer', {message: sanitizeHTML(data.message, {allowedTags: [], allowedAttributes: {}}), username: user.username, avatar: user.avatar})
        })
    }
})

module.exports = server