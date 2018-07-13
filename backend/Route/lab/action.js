const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment')
module.exports = (router,{
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.get('/search', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let keyword = req.query.keyword || ''
    let start = (page - 1) * limit
    let labs = await Model.lab.searchLab(keyword,start,limit)
    let ret = {
      labs
    }
    res.success(ret)
  }))
  router.get('/all', Wrapper(async (req,res,next) => {
    const limit = 10
    let page = parseInt(req.query.page) || 1
    let start = (page - 1) * limit
    let labs = await Model.lab.getAllLab(start,limit)
    let ret = {
      labs
    }
    if(page === 1){
      ret.total = await Model.lab.getLabCount()
    }
    res.success(ret)
  }))
  router.post('/create', Wrapper(async (req,res,next) => {
    const limit = 10
    let name = req.body.name
    let instruction = req.body.instruction
    let sec_id = parseInt(req.body.sec_id)
    if(!name || !instruction || !sec_id)
      throw new Errors.InvalidParameter('相关参数未填写')
    
    let result = await Model.secretary.getSecretaryById(sec_id)
    if(!result)
      throw new Errors.InvalidParameter('不存在此秘书')
    result = await Model.lab.getLabByName(name)
    if(result){
      throw new Errors.InvalidParameter('研究室名称已存在')
    }
    await Model.lab.createLab(name,instruction,sec_id)
    res.success({
      name
    })
  }))
}
