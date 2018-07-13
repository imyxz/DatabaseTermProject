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
      lab: req.lab
    })
  }))
  router.post('/update', Wrapper(async (req,res,next) => {
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
    await Model.lab.updateLab(name,instruction,sec_id)
    res.success({
      name
    })
  }))
  router.post('/delete',Wrapper(async (req,res,next) => {
    await Model.lab.del(req.lab.id)
    res.success({
    })
  }))
  
}
