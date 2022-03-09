const {
    Router
} = require('express')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    res.render('page/index', {
        isHome: true,
        layout: res.locals.userRole,
        success: req.flash('success'),
        error: req.flash('error'),
    })
})



module.exports = router