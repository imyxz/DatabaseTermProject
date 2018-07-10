const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
module.exports = (router,{
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.post('/login', Wrapper(async (req, res, next) => {
    let username = req.body.username || ""
    let password = req.body.password || ""
    let user = await Model.user.checkLogin(username,password)
    if(user === false)
    {
      throw new Errors.InvaildAuth('账号或密码错误')
    }
    else{
      req.session.user_id = user.id
      res.success({
      })
    }
  }))
}