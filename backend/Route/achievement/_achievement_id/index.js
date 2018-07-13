module.exports = (router,{Model,Errors,Wrapper}) => {
  router.use(Wrapper(async (req,res,next) => {
    let achievement_id = parseInt(req.params.achievement_id)
    if(!achievement_id) throw new Errors.InvalidParameter('无此项目')
    let achievement  = await Model.achievement.getAchievementById(achievement_id)
    if(!achievement) throw new Errors.InvalidParameter('无此项目')
    req.achievement = achievement
    next()
  }))
}