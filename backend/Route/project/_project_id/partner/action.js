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
    let partners = await Model.organization.getAllPartner(req.project.id)
    res.success({
      partners
    })
  }))
  router.post('/save', Wrapper(async (req,res,next) => {
    let project_id = req.project.id
    let req_partners = req.body
    if(!req_partners || !(req_partners instanceof Array))
      throw new Errors.InvalidParameter('请求参数错误')
    await Model.organization.delAllPartner(project_id)
    let promises = req_partners.map(e => {
      return Model.organization.addPartner(project_id,e.id)
    })
    await Promise.all(promises)
    res.success({})
  }))
  router.post('/update', Wrapper(async (req,res,next) => {
    let name = req.body.name
    let research_content = req.body.research_content
    let money = parseFloat(req.body.money)
    let start_time = moment(req.body.start_time)
    let end_time = moment(req.body.end_time)
    let lab_name = req.body.lab_name
    let incharger_id = req.body.incharger_id
    let principal_id = req.body.principal_id
    let checker_id = req.body.checker_id
    if(!name || !research_content || !money || !start_time.isValid() || !end_time.isValid() || !lab_name || !incharger_id || !principal_id || !checker_id)
      throw new Errors.InvalidParameter('相关参数未填写')
    let lab = await Model.lab.getLabByName(lab_name)
    if(!lab)
      throw new Errors.InvalidParameter('无此研究所')
    let project_id = await Model.project.createProject(name,research_content,money,start_time.toDate(),end_time.toDate(),lab_name,incharger_id,principal_id,checker_id)
    res.success({
      project_id
    })
  }))
}
