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
    let organizations = await Model.organization.searchOrganization(keyword,start,limit)
    let ret = {
      organizations
    }
    res.success(ret)
  }))
  router.get('/all', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let start = (page - 1) * limit
    let organizations = await Model.organization.getAllOrganization(start,limit)
    let ret = {
      organizations
    }
    if(page === 1){
      ret.total = await Model.organization.getOrganizationCount()
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req,res,next) => {
    const limit = 10
    let name = req.body.name
    let address = req.body.address
    if(!name || !address)
      throw new Errors.InvalidParameter('相关参数未填写')
    
    let organization_id = await Model.organization.createOrganization(name,address)
    res.success({
      organization_id
    })
  }))
}
