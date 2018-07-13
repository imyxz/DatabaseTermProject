module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let work_id = parseInt(req.params.work_id)
    if(!work_id) throw new Errors.InvalidParameter('无此项目')
    let work  = await Model.work.getWorkById(work_id)
    if(!work) throw new Errors.InvalidParameter('无此项目')
    req.work = work
    next()
  }))
}