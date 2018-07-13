module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let organization_id = parseInt(req.params.organization_id)
    if(!organization_id) throw new Errors.InvalidParameter('无此项目')
    let organization  = await Model.organization.getOrganizationById(organization_id)
    if(!organization) throw new Errors.InvalidParameter('无此项目')
    req.organization = organization
    next()
  }))
}