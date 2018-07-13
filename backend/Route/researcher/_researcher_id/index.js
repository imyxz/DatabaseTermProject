module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let researcher_id = parseInt(req.params.researcher_id)
    if(!researcher_id) throw new Errors.InvalidParameter('无此项目')
    let researcher  = await Model.researcher.getResearcherById(researcher_id)
    if(!researcher) throw new Errors.InvalidParameter('无此项目')
    req.researcher = researcher
    next()
  }))
}