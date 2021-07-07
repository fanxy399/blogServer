const querystring = require('querystring')
const {setRedis, getRedis} = require('./src/db/redis')
const {access} = require('./src/utils/log')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if(req.method !== 'POST'){
      resolve({})
      return
    }
    if(req.headers['content-type'] !== 'application/json'){
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString('utf-8')
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
          JSON.parse(postData)
      )
    })
  })
}

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

const serverHandle = (req, res) => {
  access(`${Date()} -- ${req.method} -- ${req.url} -- ${req.headers['user-agent']}`)
  // 设置返回格式 JSON
  res.setHeader('Content-type', 'application-json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  //解析query
  req.query = querystring.parse(url.split('?')[1])
  
  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''  // k1=v1;k2=v2;k3=v3
  cookieStr.split(';').forEach(item => {
      if (!item) {
          return
      }
      const arr = item.split('=')
      const key = arr[0].trim()
      const val = arr[1].trim()
      req.cookie[key] = val
  })

  // 解析 session （使用 redis）
  let needSetCookie = false
  let userId = req.cookie.userId
  if(!userId){
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    setRedis(userId, {})
  }
  req.sessionId = userId
  getRedis(userId).then(sessionData => {
    req.session = sessionData || {}
    return getPostData(req)
  }).then( postData => {
    req.body = postData

    // 博客路由
    const blogReslut = handleBlogRouter(req, res)
    if( blogReslut){
      blogReslut.then(blogData => {
        if(needSetCookie){
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 用户路由
    const userReslut = handleUserRouter(req, res)
    if( userReslut){
      userReslut.then(userData => {
        if(needSetCookie){
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    //为命中路由， 返回404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found \n")
    res.end()
    })
}

module.exports = serverHandle