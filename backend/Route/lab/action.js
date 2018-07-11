const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment')
module.exports = (router,{
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.get('/search', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let keyword = req.query.keyword || ''
    let start = (page - 1) * limit
    let labs = await Model.lab.searchLab(keyword,start,limit)
    let ret = {
      labs
    }
    res.success(ret)
  }))
  router.get('/all', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let start = (page - 1) * limit
    let labs = await Model.lab.getAllLab(start,limit)
    let ret = {
      labs
    }
    if(page === 1){
      ret.total = await Model.lab.getLabCount()
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req,res,next) => {
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
    let project_id = await Model.project.createProject(name,research_content,money,start_time.toDate(),end_time.toDate())
    res.success({
      project_id
    })
  }))
}
