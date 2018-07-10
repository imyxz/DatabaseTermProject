module.exports = function(fn){
  return function(req, res, next){
    fn(req,res,next).catch(e=>{
      //process the error here
      if(e !== null && typeof e === 'object' && typeof e.handler === 'function')
        e.handler(req,res,next)
      else
      {
        console.log(e)
        res.status(500).send('Internal error')
      }
      //next(e)
    })
  }
}
