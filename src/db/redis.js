const redis = require('redis')
const {REDIS_CONF} = require('../config/db')

const redisClient = redis.createClient(REDIS_CONF)

redisClient.on('error', err => {
  console.error(err)
})

const setRedis = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

const getRedis = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if(err) return reject(err)
      try {
        resolve(JSON.parse(val))
      } catch (ex) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  setRedis,
  getRedis
}