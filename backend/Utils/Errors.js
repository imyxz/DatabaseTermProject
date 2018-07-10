class InvalidParameter extends Error {
  handler(req,res,next){
    res.send({
      status: 1,
      err_msg: this.message
    })
  }
}
class InvaildAuth extends InvalidParameter{
  handler(req,res,next){
    res.send({
      status: 1,
      err_msg: this.message
    })
  }
}
class PermissionDenied extends Error {
  handler(req,res,next){
    res.send({
      status: 1,
      err_msg: this.message
    })
  }
}
class RequireLogin extends PermissionDenied{
  handler(req,res,next){
    res.send({
      status: 1,
      err_msg: this.message
    })
  }
}
class ObjectNotFound extends Error {
  handler(req,res,next){
    res.send({
      status: 1,
      err_msg: this.message
    })
  }
}
class InternalError extends Error {
}
class ExternalServiceError extends Error {
}
module.exports = {
  InvalidParameter,
  InvaildAuth,
  PermissionDenied,
  ObjectNotFound,
  InternalError,
  ExternalServiceError,
  RequireLogin
}
