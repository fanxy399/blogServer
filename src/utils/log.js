const fs = require('fs')
const path = require('path')

// 生成 write Stream
const createWriteStream = (fileName) => {
  const file = path.join(__dirname, '../', '../' , 'logs', fileName)
  const writeStream = fs.createWriteStream(file, {flags: 'a'})
  return writeStream
}

// 写日志
const writeLog = (writeStream, log) => {
  writeStream.write(log + '\n')
}

// 写访问日志
const access = (log) => {
  writeLog(createWriteStream('access.log'), log)
}

module.exports = {
  access
}