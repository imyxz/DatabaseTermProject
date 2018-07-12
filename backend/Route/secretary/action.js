const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment')
module.exports = (router,{
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.get('/all', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let start = (page - 1) * limit
    let secretarys = await Model.secretary.getAllSecretary(start,limit)
    let ret = {
      secretarys
    }
    if(page === 1){
      ret.total = await Model.secretary.getSecretaryCount()
    }
    res.success(ret)
  }))
  router.get('/search', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let keyword = req.query.keyword || ''
    let start = (page - 1) * limit
    let secretarys = await Model.secretary.search(keyword,start,limit)
    let ret = {
      secretarys
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req,res,next) => {
    let name = req.body.name
    let sex = req.body.sex
    let responsibility = req.body.responsibility
    let age = parseInt(req.body.age)
    let hired_time = moment(req.body.hired_time)
    if(!name || !sex || !responsibility || !age || !hired_time.isValid())
      throw new Errors.InvalidParameter('相关参数未填写')
    if(['male','female','secret'].indexOf(sex) === -1)
    throw new Errors.InvalidParameter('性别未按要求填写')
    let secretary_id = await Model.secretary.createSecretary(name,sex,age,responsibility,hired_time.toDate())
    res.success({
      secretary_id
    })
  }))
}
