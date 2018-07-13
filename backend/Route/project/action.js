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
    let projects = await Model.project.getAllProject(start,limit)
    let ret = {
      projects
    }
    if(page === 1){
      ret.total = await Model.project.getProjectCount()
    }
    res.success(ret)
  }))
  router.get('/search', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let keyword = req.query.keyword || ''
    let start = (page - 1) * limit
    let projects = await Model.project.search(keyword,start,limit)
    let ret = {
      projects
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req,res,next) => {
    const limit = 10
    let name = req.body.name
    let research_content = req.body.research_content
    let money = parseFloat(req.body.money)
    let start_time = moment(req.body.start_time)
    let end_time = moment(req.body.end_time)
    let lab_name = req.body.lab_name
    let incharger_id = req.body.incharger_id
    let principal_id = req.body.principal_id
    let checker_id = req.body.checker_id
    if(!name || !research_content || !money || !start_time.isValid() || !end_time.isValid() || !lab_name || !incharger_id || !principal_id || !checker_id)
      throw new Errors.InvalidParameter('相关参数未填写')
    let lab = await Model.lab.getLabByName(lab_name)
    if(!lab)
      throw new Errors.InvalidParameter('无此研究所')
    let project_id = await Model.project.createProject(name,research_content,money,start_time.toDate(),end_time.toDate(),lab_name,incharger_id,principal_id,checker_id)
    res.success({
      project_id
    })
  }))
}
