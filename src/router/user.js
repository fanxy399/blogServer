const { SuccessModel,ErrorModel } = require('../model/resModel')
const { loginCheck } = require('../controller/login')

const handleUserRouter = (req, res) => {
  const method = req.method

  // 登录
  if(method === 'POST' && req.path === '/api/user/login'){
    const { username, password } = req.body
    return loginCheck( username, password ).then(res => {
      return res.username ? new SuccessModel('用户登陆成功') : new ErrorModel('用户登陆失败')
    })
    
  }
}

module.exports = handleUserRouter