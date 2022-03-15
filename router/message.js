const {
    Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Users = require('../model/user')
const Message = require('../model/message')
const e = require('connect-flash')


router.get('/', auth,  async(req, res) => {
    let users = await Users.find().lean()
    let userId = res.locals.user._id
    users = users.map(user => {
            user.logoutTime =  user.logoutTime ? (new Date(user.logoutTime)).toLocaleDateString('en-CA') + ' ' + (new Date(user.logoutTime)).toLocaleTimeString('en-GB') : ''
            return user
    })
    let index = users.findIndex(el => el.login == res.locals.user.login)
    users.splice(index, 1)
    let messages = await Message.find({userId}).populate("user", '_id name img').lean()
    res.render('message', {
        isMessage: true,
        title: "Habarlar",
        layout: res.locals.userRole,
        success: req.flash('success'),
        error: req.flash('error'),
        users,
        messages
    })
})

router.get('/get/:id', auth,  async(req, res) => {
    let userId = res.locals.user._id
    let user = req.params.id
    let messages = await Message.find({user}).populate("user", '_id name img').lean()
    let msgMe = await Message.find({user:userId, userId: user}).populate("user", '_id name img').lean()
    msgMe = msgMe.map(message => {
        message.msg = true
        message.createdAt =  message.createdAt ? (new Date(message.createdAt)).toLocaleDateString('en-CA') + ' ' + (new Date(message.createdAt)).toLocaleTimeString('en-GB') : ''
        return message
    })
    messages = messages.map(message => {
        message.msg = false
        message.createdAt =  message.createdAt ? (new Date(message.createdAt)).toLocaleDateString('en-CA') + ' ' + (new Date(message.createdAt)).toLocaleTimeString('en-GB') : ''
        return message
    })
    const messageAll = messages.concat(msgMe);
    messageAll.sort(function(a, b) {
        var c = new Date(a.createdAt);
        var d = new Date(b.createdAt);
        return c-d;
    });
    let userInfo = await Users.findOne({
        _id:user
    })
    userInfo.logoutTime =  userInfo.logoutTime ? (new Date(userInfo.logoutTime)).toLocaleDateString('en-CA') + ' ' + (new Date(userInfo.logoutTime)).toLocaleTimeString('en-GB') : ''
    messageAll.unshift(userInfo)
    res.send(messageAll)
})

router.post('/create', auth, async(req, res) => {
    let {userId, title} = req.body
    let user = res.locals.user._id
    let message = await new Message({user, userId,title})
    await message.save()
    res.redirect('/message')
})

module.exports = router