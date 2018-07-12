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
    let works = await Model.work.getAll(req.project.id)
    res.success({
      works
    })
  }))
  router.post('/save', Wrapper(async (req,res,next) => {
    let works = await Model.work.getAll(req.project.id)
    let project_id = req.project.id
    let req_works = req.body
    if(!req_works || !(req_works instanceof Array))
      throw new Errors.InvalidParameter('请求参数错误')
    let [adds,dels,change,both] = getDiff(works,req_works,'id',['id','requirement','sequence','dead_line','money','incharger_id'])
    for(let i = 0;i<adds.length;i++){
      let item = adds[i]
      let researcher = await Model.researcher.getResearcherById(item.incharger_id)
      if(!researcher) throw new Errors.InvalidParameter('不存在此研究员')
    }
    for(let i = 0;i<change.length;i++){
      let item = change[i]
      let researcher = await Model.researcher.getResearcherById(item.incharger_id)
      if(!researcher) throw new Errors.InvalidParameter('不存在此研究员')
    }
    let promises = []
    dels.forEach(e => {
      promises.push(Model.work.delete(project_id,e.id))
    })
    adds.forEach(e => {
      promises.push(Model.work.add(project_id,e))
    })
    change.forEach(e => {
      promises.push(Model.work.save(e.id,e))
    })
    await Promise.all(promises)
    res.success({
    })
  }))
}
