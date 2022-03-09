const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const mongoose = require('mongoose')

const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) // !
// const helpers = require('handlebars-helpers')()
// helpers.is = function(a, b, options) {
//     if (arguments.length === 2) {
//       options = b;
//       b = options.hash.compare;
//     }
//     return util.value(a == b, this, options);
//   };
const flash = require('connect-flash') // !

// router require
const usersRouter = require('./router/users')
const pageRouter = require('./router/page')
const categoryRouter = require('./router/category')

// middleware require
const varMiddle = require('./middleware/var')
// const layout = require('./middleware/layout')
const hbs = exphbs.create({
    defaultLayout: 'adminlayout',
    extname: '.hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({
    extended: true
}))
const MONGODB_URI = 'mongodb://127.0.0.1:27017/students'
let store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
})
app.use(session({
    secret: 'laksjdhlkasjdhsakj',
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    },
    resave: true,
    store
}))

hbs.handlebars.registerHelper("increment", function(value)
{
    return parseInt(value) + 1;
});

// hbs.handlebars.registerHelper('ifeq', function(a, b, options) {
//     if (a == b) return options.fn(this)
//     else return options.inverse(this)
//   });

app.use(csrf())
app.use(cookieParser())
app.use(flash()) // !
app.use(varMiddle)


app.use('/', pageRouter)
app.use('/users', usersRouter)
app.use('/category', categoryRouter)
app.all('*', (req, res) => {
    res.status(404).render('404', {
        layout: "404"
    });
});

async function dev() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true
        })
        app.listen(3000, () => {
            console.log(`Server is running 3000`)
        })
    } catch (error) {
        console.log(error)
    }
}
dev()