module.exports = (req,res,next) =>{
    if(req.session.userRole == 2 && req.baseUrl == '/users'){
        res.redirect('/users/login')
    }
    if (!req.session.isAuthed ){
        res.redirect('/users/login')
    }
    next()
}