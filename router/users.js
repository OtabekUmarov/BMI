const {
    Router
} = require('express')
const router = Router()
const Users = require('../model/user')
const bcrypt = require('bcryptjs')
const auth = require("../middleware/auth")

router.get('/', auth, async (req, res) => {
    let users = await Users.find().lean()
    users = users.map((el)=> {
        return {
            ...el,
            role: el.role == 1 ? "Superadmin" : "Foydalanuvchi",
            delete: el.role == 1 ? false : true
        }
    })
    res.render('users', {
        title: 'Foydalanuvchilar',
        isUsers: true,
        layout: res.locals.userRole,
        users,
        success: req.flash('success'),
        error: req.flash('error'),
    })
})
router.get('/login', async (req, res) => {
    res.render('users/login', {
        title: 'Tizimga kirish',
        layout: 'no-head',
        success: req.flash('success'),
        error: req.flash('error'),
    })
})
router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        res.redirect('/users/login')
    })
})
router.post('/login', async (req, res) => {
    let {
        login,
        password
    } = req.body

    let checkUser = await Users.findOne({
        login
    }).lean()
    if (checkUser) {
        let comparePass = await bcrypt.compare(password, checkUser.password)
        if (comparePass) {
            req.session.isAuthed = true
            req.session.user = checkUser
            req.session.userRole = checkUser.role
            req.flash('success', 'Tizimga muvaffaqiyatli kirdingiz!')
            res.redirect('/')
        } else {
            req.flash('error', "Parolingiz noto'gri")
            res.redirect('/users/login')
        }
    } else {
        req.flash('error', "Bunday logindagi foydalanuvchi yo'q")
        res.redirect('/users/login')
    }
})

router.get('/check/:login', async (req, res) => {
    let login = req.params.login
    let checkLogin = await Users.findOne({
        login
    })
    if (checkLogin) {
        res.send(true)
    } else {
        res.send(false)
    }
})
router.get('/edit/:id', auth, async (req, res) => {
    let _id = req.params.id
    let user = await Users.findOne({
        _id
    })
    res.send(user)
})

router.get('/reg', async (req, res) => {
    res.render('users/reg', {
        layout: 'no-head',
        title: 'Ro`yhatdan o`tish',
    })
})
router.post('/reg', async (req, res) => {
    let {
        login,
        password,
        name
    } = req.body
    const checkUser = await Users.findOne({
        login
    }).lean()
    if (checkUser) {
        res.redirect('/users/reg')
    } else {
        let hashpass = await bcrypt.hash(password, 6)
        let user = await new Users({
            login,
            password: hashpass,
            name
        })
        await user.save()
        res.redirect('/users/login')
    }
})
router.post('/admin/reg', auth, async (req, res) => {
    let {
        login,
        password,
        name,
        role
    } = req.body
    const checkUser = await Users.findOne({
        login
    }).lean()
    if (checkUser) {
        res.redirect('/users')
    } else {
        let hashpass = await bcrypt.hash(password, 6)
        let user = await new Users({
            login,
            password: hashpass,
            role,
            name
        })
        await user.save()
        req.flash('success', "Foydalanuvchi qo'shildi")
        res.redirect('/users')
    }
})

router.post("/admin/save", auth, async(req,res)=> {
    let {_id, name, login, role} = req.body
    await Users.findByIdAndUpdate(_id, {name, login, role})
    res.redirect('/users')
})
router.get("/delete/:id", auth, async(req,res) => {
    await Users.findByIdAndDelete(
        req.params.id
    )
    res.redirect('/users')
})
module.exports = router