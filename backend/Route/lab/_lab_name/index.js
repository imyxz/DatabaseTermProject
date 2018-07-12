module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let lab_name = decodeURIComponent(req.params.lab_name)
    if(!lab_name) throw new Errors.InvalidParameter('无此项目')
    let lab  = await Model.lab.getLabByName(lab_name)
    if(!lab) throw new Errors.InvalidParameter('无此项目')
    req.lab = lab
    next()
  }))
}