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
    let researchers = await Model.researcher.getAllResearcher(start,limit)
    let ret = {
      researchers
    }
    if(page === 1){
      ret.total = await Model.researcher.getResearcherCount()
    }
    res.success(ret)
  }))
  router.get('/search', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let keyword = req.query.keyword || ''
    let start = (page - 1) * limit
    let researchers = await Model.researcher.search(keyword,start,limit)
    let ret = {
      researchers
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req,res,next) => {
    let name = req.body.name
    let sex = req.body.sex
    let title = req.body.title
    let age = parseInt(req.body.age)
    let major = req.body.major
    let lab = req.body.lab
    console.log(name,sex,title,age,major,lab)
    if(!name || !sex || !title || !age || !major || !lab)
      throw new Errors.InvalidParameter('相关参数未填写')
    let result = await Model.lab.getLabByName(lab)
    if(!result)
      throw new Errors.InvalidParameter('不存在此研究所')
    if(['male','female','secret'].indexOf(sex) === -1)
    throw new Errors.InvalidParameter('性别未按要求填写')
    let researcher_id = await Model.researcher.createResearcher(name,sex,age,title,major,lab)
    res.success({
      researcher_id
    })
  }))
}
