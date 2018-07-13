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
      researcher: req.researcher
    })
  }))
  router.post('/update', Wrapper(async (req,res,next) => {
    let researcher_id = req.researcher.id
    const limit = 10
    let name = req.body.name
    let sex = req.body.sex
    let title = req.body.title
    let age = parseInt(req.body.age)
    let major = req.body.major
    let lab = req.body.lab
    if(!name || !sex || !title || !age || !major || !lab)
      throw new Errors.InvalidParameter('相关参数未填写')
    let result = await Model.lab.getLabByName(lab)
    if(!result)
      throw new Errors.InvalidParameter('不存在此研究所')
    if(['male','female','secret'].indexOf(sex) === -1)
      throw new Errors.InvalidParameter('性别未按要求填写')
    await Model.researcher.updateResearcher(researcher_id,name,sex,age,title,major,lab)
    res.success({
      researcher_id
    })
  }))
  router.post('/delete',Wrapper(async (req,res,next) => {
    await Model.researcher.del(req.researcher.id)
    res.success({
    })
  }))
  
}
