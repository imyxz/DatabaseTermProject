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
      achievement: req.achievement
    })
  }))
  router.post('/update', Wrapper(async (req, res, next) => {
    let achievement_id = req.achievement.id
    let name = req.body.name
    let time = moment(req.body.time)
    let rank = parseInt(req.body.rank)
    let project = parseInt(req.body.project)
    let type = req.body.type
    if (!name || !rank || !project || !time.isValid() || !type)
      throw new Errors.InvalidParameter('相关参数未填写')
    let result = await Model.project.getProjectById(project)
    if (!result)
      throw new Errors.InvalidParameter('不存在此项目')
    if (['paper', 'software', 'patent_invention', 'patent_utility', 'patent_design'].indexOf(type) === -1)
      throw new Errors.InvalidParameter('类型未按要求填写')
    await Model.achievement.updateAchievement(achievement_id,name,time.toDate(),rank,project,type)
    res.success({
      achievement_id
    })
  }))
  router.post('/delete',Wrapper(async (req,res,next) => {
    await Model.achievement.del(req.achievement.id)
    res.success({
    })
  }))
}
