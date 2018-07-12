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
    let researchers = await Model.lab.searchResearcher(req.lab.name,keyword,start,limit)
    let ret = {
      researchers
    }
    res.success(ret)
  }))
}