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
    let researchers = await Model.work.getAllResearcher(req.work.id)
    res.success({
      researchers
    })
  }))
  router.post('/save', Wrapper(async (req,res,next) => {
    let work_id = req.work.id
    let req_partners = req.body
    if(!req_partners || !(req_partners instanceof Array))
      throw new Errors.InvalidParameter('请求参数错误')
    await Model.work.delAllResearcher(work_id)
    let promises = req_partners.map(e => {
      return Model.work.addResearcher(work_id,e.id)
    })
    await Promise.all(promises)
    res.success({})
  }))
}
