const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()

router.get('/',auth,async(req,res)=>{
    
})

module.exports = router