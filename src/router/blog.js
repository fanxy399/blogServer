const { SuccessModel,ErrorModel } = require('../model/resModel')
const { getBlogList, getBlogDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')

const handleBlogRouter = (req, res) => {
  const method = req.method

  // 博客列表
  if(method === 'GET' && req.path === '/api/blog/list'){
    const {author = null, keyword = null} = req.query
    const data = getBlogList(author, keyword)
    return new SuccessModel(data, '博客列表查询成功')
  }
  // 博客详情
  if(method === 'GET' && req.path === '/api/blog/detail'){
    const { id } = req.query
    const data = getBlogDetail(id)
    return new SuccessModel(data, '博客详情查询成功')
  }
  // 添加博客
  if(method === 'POST' && req.path === '/api/blog/new'){
    const data = newBlog(req.body)
    return new SuccessModel(data, '新增博客成功')
  }
  // 编辑博客
  if(method === 'POST' && req.path === '/api/blog/update'){
    const { id } = req.query
    const result = updateBlog(id)
    return result ? new SuccessModel('博客编辑成功') : new ErrorModel('博客编辑失败')
  }
  // 删除博客
  if(method === 'POST' && req.path === '/api/blog/del'){
    const { id } = req.query
    const result = deleteBlog(id)
    return result ? new SuccessModel('博客删除成功') : new ErrorModel('博客删除失败')
  }
}

module.exports = handleBlogRouter