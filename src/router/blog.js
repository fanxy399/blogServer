const { SuccessModel,ErrorModel } = require('../model/resModel')
const { getBlogList, getBlogDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')

const loginCheck = (req) => {
  if(!req.session.username){
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method

  // 博客列表
  if(method === 'GET' && req.path === '/api/blog/list'){
    const {author = null, keyword = null} = req.query
    if(req.query.isadmin) {
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) return loginCheckResult

      // 强制查询自己的博客
      author = req.session.username
    }
    return getBlogList(author, keyword).then(res => {
      return new SuccessModel(res, '博客列表查询成功')
    })
  }
  // 博客详情
  if(method === 'GET' && req.path === '/api/blog/detail'){
    const { id=null } = req.query
    if (!id) return Promise.resolve(new ErrorModel('请输入博客id'))
    return getBlogDetail(id).then(res => new SuccessModel(res, '博客详情查询成功'))
  }
  // 添加博客
  if(method === 'POST' && req.path === '/api/blog/new'){
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) return loginCheckResult
    req.body.author = req.session.username
    return newBlog(req.body).then(res => {
      return new SuccessModel(res, '新增博客成功')
    })
  }
  // 编辑博客
  if(method === 'POST' && req.path === '/api/blog/update'){
    const { id } = req.query
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) return loginCheckResult
    return updateBlog(id, req.body).then(res => {
      return res ? new SuccessModel('博客编辑成功') : new ErrorModel('博客编辑失败')
    })
  }
  // 删除博客
  if(method === 'POST' && req.path === '/api/blog/del'){
    const { id } = req.query
    const loginCheckResult = loginCheck(req)
    const author = req.session.username
    if (loginCheckResult) return loginCheckResult
    return deleteBlog(id, author).then(res => {
      return res ? new SuccessModel('博客删除成功') : new ErrorModel('博客删除失败')
    })
  }
}

module.exports = handleBlogRouter