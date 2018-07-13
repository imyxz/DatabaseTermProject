const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment')
module.exports = (router,{
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.get('/info',Wrapper(async (req,res,next) => {
    res.success({
      secretary: req.secretary
    })
  }))
  router.post('/update', Wrapper(async (req,res,next) => {
    let secretary_id = req.secretary.id
    let name = req.body.name
    let sex = req.body.sex
    let responsibility = req.body.responsibility
    let age = parseInt(req.body.age)
    let hired_time = moment(req.body.hired_time)
    if(!name || !sex || !responsibility || !age || !hired_time.isValid())
      throw new Errors.InvalidParameter('相关参数未填写')
    if(['male','female','secret'].indexOf(sex) === -1)
      throw new Errors.InvalidParameter('性别未按要求填写')
    await Model.secretary.updateSecretary(secretary_id,name,sex,age,responsibility,hired_time.toDate())
    res.success({
      secretary_id
    })
  }))
  router.post('/delete',Wrapper(async (req,res,next) => {
    await Model.secretary.del(req.secretary.id)
    res.success({
    })
  }))
  
}
