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
      organization: req.organization
    })
  }))
  router.post('/update', Wrapper(async (req,res,next) => {
    let organization_id = req.organization.id
    const limit = 10
    let name = req.body.name
    let address = req.body.address
    if(!name || !address)
      throw new Errors.InvalidParameter('相关参数未填写')
    await Model.organization.updateOrganization(organization_id,name,address)
    res.success({
      organization_id
    })
  }))
  router.post('/delete',Wrapper(async (req,res,next) => {
    await Model.organization.del(req.organization.id)
    res.success({
    })
  }))
  
}
