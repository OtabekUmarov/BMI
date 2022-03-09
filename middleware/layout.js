
  const express = require('express')
  const exphbs = require('express-handlebars')
  const app = express()

module.exports = (req,res,next) =>{
    let layoutRole = req.session.userRole == 1 ? "adminlayout" : "userslayout"
    console.log(layoutRole);
    const hbs = exphbs.create({
      defaultLayout: layoutRole,
      extname: '.hbs'
  })
  // app.engine('hbs', hbs.engine)
  // app.set('view engine', 'hbs')
  exphbs.ExpressHandlebars.prototype.defaultLayout = layoutRole
  exphbs.ExpressHandlebars.prototype.layout = layoutRole
  next()
}