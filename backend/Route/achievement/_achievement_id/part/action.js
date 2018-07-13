const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment')
function isSame(obj_a,obj_b,props){
  props.forEach(e => {
    if(obj_a[e] != obj_b[e])
      return false
  })
  return true
}
function getDiff(arr_a,arr_b,id_name,props){
  let adds = []
  let dels = []
  let both = []
  let change = []
  let tmp_b = {}
  let tmp_a = {}
  arr_b.forEach(e => {
    tmp_b[e[id_name]] = e
  })
  arr_a.forEach(e => {
    tmp_a[e[id_name]] = e
    let id = e[id_name]
    if(tmp_b[id]!==undefined)
    {
      both.push(e)
      if(!isSame(e,tmp_b[id],props))
        change.push(tmp_b[id])
    }
    else{
      dels.push(e)
    }
  })
  arr_b.forEach(e => {
    let id = e[id_name]
    if(tmp_a[id]=== undefined)
      adds.push(e)
  })
  return [adds,dels,change,both]
}
module.exports = (router,{
  Model,
  Wrapper,
  Errors
}) => {
  router.use(jsonParser)
  router.get('/all', Wrapper(async (req,res,next) => {
    let parts = await Model.achievement.getAllParticipant(req.achievement.id)
    res.success({
      parts
    })
  }))
  router.post('/save', Wrapper(async (req,res,next) => {
    let achievement_id = req.achievement.id
    let req_partners = req.body
    if(!req_partners || !(req_partners instanceof Array))
      throw new Errors.InvalidParameter('请求参数错误')
    await Model.achievement.delAllParticipant(achievement_id)
    let promises = req_partners.map(e => {
      return Model.achievement.addParticipant(achievement_id,e.id)
    })
    await Promise.all(promises)
    res.success({})
  }))
}
