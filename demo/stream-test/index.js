const http = require('http')
const fs = require('fs')
const path = require('path')

const file1 = path.resolve(__dirname, 'file1.txt')
const file2 = path.resolve(__dirname, 'file2.txt')

// // 读取文件
// fs.readFile(file2, (err, data) => {
//   if(err) return console.log(err)
//   console.log(data.toString())
// })

// // 写入文件
// const content = '\n这是新写入的内容\n'
// const opt = {
//     flag: 'a'  // 追加写入。覆盖用 'w' a:append w:write
// }
// fs.writeFile(file2, content, opt, (err) => {
//   if(err) console.log(err)
// })

// // 判断文件是否存在
// fs.exists(file2, (exist) => {
//   console.log(`${file2} is ${exist}`)
// })

// 复制file1文件到file2
const readStream = fs.createReadStream(file1)
const writeStream = fs.createWriteStream(file2)

// // 管道传输
// readStream.pipe(writeStream)

// // 分流监听
// readStream.on('data',(chunk) =>{
//   console.log(chunk.toString())
// })
// // 监听结束
// readStream.on('end', () => {
//   console.log(' copy done ')
// })


const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        readStream.pipe(res)
    }
})
server.listen(399)