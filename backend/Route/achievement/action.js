const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment')
module.exports = (router, {
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.get('/all', Wrapper(async (req, res, next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let start = (page - 1) * limit
    let achievements = await Model.achievement.getAllAchievement(start, limit)
    let ret = {
      achievements
    }
    if (page === 1) {
      ret.total = await Model.achievement.getAchievementCount()
    }
    res.success(ret)
  }))
  router.get('/search', Wrapper(async (req, res, next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let keyword = req.query.keyword || ''
    let start = (page - 1) * limit
    let achievements = await Model.achievement.search(keyword, start, limit)
    let ret = {
      achievements
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req, res, next) => {
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
    let achievement_id = await Model.achievement.createAchievement(name,time.toDate(),rank,project,type)
    res.success({
      achievement_id
    })
  }))
}