const {
    Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Users = require('../model/user')


router.get('/', auth,  async(req, res) => {
    let users = await Users.find().lean()
    res.render('message', {
        isMessage: true,
        title: "Habarlar",
        layout: res.locals.userRole,
        success: req.flash('success'),
        error: req.flash('error'),
        users
    })
})



module.exports = router