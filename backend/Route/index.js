const session = require('express-session')
const cookieParser = require('cookie-parser')
module.exports = (router, {
  Model,
  Config,
  Errors,
  Wrapper
}) => {
  router.use(session({
    secret: Config.env.session_secret,
    resave: false,
    proxy: true
  }))
  router.use(function(req, res, next) {
    res.error = function(obj) {
      res.json({
        err_msg: obj,
        status: 1
      })
    }
    res.success = function(obj, filters) {
      let target = {}
      if(filters instanceof Array)
      {
        filters.forEach(e => {
          target[e] = obj[e]
        })
      } else {
        target = obj
      }
      res.json({
        ...target,
        status: 0
      })
    }
    next()
  })
  router.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
}
