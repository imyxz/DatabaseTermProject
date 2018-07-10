const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
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
}
