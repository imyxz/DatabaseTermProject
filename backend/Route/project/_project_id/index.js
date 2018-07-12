module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let project_id = parseInt(req.params.project_id)
    if(!project_id) throw new Errors.InvalidParameter('无此项目')
    let project  = await Model.project.getProjectById(project_id)
    if(!project) throw new Errors.InvalidParameter('无此项目')
    req.project = project
    next()
  }))
}