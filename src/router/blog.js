const { SuccessModel,ErrorModel } = require('../model/resModel')
const { getBlogList, getBlogDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')

const handleBlogRouter = (req, res) => {
  const method = req.method

  // 博客列表
  if(method === 'GET' && req.path === '/api/blog/list'){
    const {author = null, keyword = null} = req.query
    return getBlogList(author, keyword).then(res => {
      return new SuccessModel(res, '博客列表查询成功')
    })
  }
  // 博客详情
  if(method === 'GET' && req.path === '/api/blog/detail'){
    const { id } = req.query
    return getBlogDetail(id).then(res => new SuccessModel(res, '博客详情查询成功'))
  }
  // 添加博客
  if(method === 'POST' && req.path === '/api/blog/new'){
    return newBlog(req.body).then(res => {
      return new SuccessModel(res, '新增博客成功')
    })
  }
  // 编辑博客
  if(method === 'POST' && req.path === '/api/blog/update'){
    const { id } = req.query
    return updateBlog(id, req.body).then(res => {
      return res ? new SuccessModel('博客编辑成功') : new ErrorModel('博客编辑失败')
    })
  }
  // 删除博客
  if(method === 'POST' && req.path === '/api/blog/del'){
    const { id } = req.query
    return deleteBlog(id, 'zhangsan').then(res => {
      return res ? new SuccessModel('博客删除成功') : new ErrorModel('博客删除失败')
    })
  }
}

module.exports = handleBlogRouter