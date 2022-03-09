module.exports = (req,res,next) =>{
    res.locals.isAuthed = req.session.isAuthed
    res.locals.csrf = req.csrfToken()
    res.locals.user = req.session.user
    res.locals.userRole = req.session.userRole == 1 ? "adminlayout" : "userslayout"
    next()
}