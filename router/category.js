const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()

router.get('/',auth,async(req,res)=>{
    res.render('category/index',{
        isCategory:true,
        title:'Bo`limlar ro`yhati'
    })
})

module.exports = router