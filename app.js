const querystring = require('querystring')

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
      postData += chunk.toString()
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

const serverHandle = (req, res) => {
  // 设置返回格式 JSON
  res.setHeader('Content-type', 'application-json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  //解析query
  req.query = querystring.parse(url.split('?')[1])

  getPostData(req).then( postData => {
    req.body = postData

    // 博客路由
    const blogReslut = handleBlogRouter(req, res)
    if( blogReslut){
      blogReslut.then(blogData => {
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 用户路由
    const userReslut = handleUserRouter(req, res)
    if( userReslut){
      userReslut.then(userData => {
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