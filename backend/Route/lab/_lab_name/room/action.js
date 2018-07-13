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
    let rooms = await Model.room.getAll(req.lab.name)
    res.success({
      rooms
    })
  }))
  router.post('/save', Wrapper(async (req,res,next) => {
    let rooms = await Model.room.getAll(req.lab.name)
    let lab_name = req.lab.name
    let req_rooms = req.body
    if(!req_rooms || !(req_rooms instanceof Array))
      throw new Errors.InvalidParameter('请求参数错误')
    let [adds,dels,change,both] = getDiff(rooms,req_rooms,'id',['id','address','area'])
    let promises = []
    dels.forEach(e => {
      promises.push(Model.room.delete(e.id))
    })
    adds.forEach(e => {
      promises.push(Model.room.add(lab_name,e))
    })
    change.forEach(e => {
      promises.push(Model.room.save(e.id,e))
    })
    await Promise.all(promises)
    res.success({
    })
  }))
}
