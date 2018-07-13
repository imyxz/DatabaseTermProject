module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let secretary_id = parseInt(req.params.secretary_id)
    if(!secretary_id) throw new Errors.InvalidParameter('无此项目')
    let secretary  = await Model.secretary.getSecretaryById(secretary_id)
    if(!secretary) throw new Errors.InvalidParameter('无此项目')
    req.secretary = secretary
    next()
  }))
}