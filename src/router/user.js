const { SuccessModel,ErrorModel } = require('../model/resModel')
const { login } = require('../controller/login')
const { setRedis } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method

  // 登录
  if(method === 'POST' && req.path === '/api/user/login'){
    const { username, password } = req.body
    return login( username, password ).then(res => {
      Object.assign(req.session, {username: res.username, realname: res.realname})
      setRedis(req.sessionId, req.session)
      return res.username ? new SuccessModel('用户登陆成功') : new ErrorModel('用户登陆失败')
    })
    
  }
}

module.exports = handleUserRouter