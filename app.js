const serverHandle = (req, res) => {
  res.setHeader('Content-type', 'application-json')
  const resData = {
    name: '双越3200',
    site: 'imooc',
    env: process.env.NODE_ENV
  }
  res.end(JSON.stringify(resData))
}

module.exports = serverHandle