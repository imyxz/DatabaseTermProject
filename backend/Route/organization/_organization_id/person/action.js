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
    let outer_persons = await Model.outer_person.getAll(req.organization.id)
    let incharger = await Model.outer_person.getIncharger(req.organization.id)
    outer_persons.forEach(e => {
      e.type="联系人"
    })
    if(incharger)
    {
      outer_persons.push(incharger)
      incharger.type="负责人"
    }
      
    res.success({
      persons:outer_persons
    })
  }))
  router.post('/save', Wrapper(async (req,res,next) => {
    let outer_persons = await Model.outer_person.getAll(req.organization.id)
    let incharger = await Model.outer_person.getIncharger(req.organization.id)
    if(incharger)
      outer_persons.push(incharger)
    let organization_id = req.organization.id
    let req_outer_persons = req.body
    if(!req_outer_persons || !(req_outer_persons instanceof Array))
      throw new Errors.InvalidParameter('请求参数错误')
    let [adds,dels,change,both] = getDiff(outer_persons,req_outer_persons,'id',['id'])
    let promises = []
    dels.forEach(e => {
      promises.push(Model.outer_person.delete(e.id))
    })
    adds.forEach(e => {
      promises.push(Model.outer_person.add(organization_id,e).then(person_id => {
        if(e.type =='incharger')
        {
          return Model.outer_person.setIncharger(organization_id,person_id)
        }
        else 
          return Model.outer_person.setContractor(organization_id,person_id)
      }))
    })
    await Promise.all(promises)
    res.success({
    })
  }))
}
