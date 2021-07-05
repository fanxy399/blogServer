
const dbConfig = {
  dev: {
    MYSQL_CONF:{
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'fan18338142404',
      database: 'myblog'
    }
  },
  production: {
    MYSQL_CONF:{
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'fan18338142404',
      database: 'myblog'
    }
  }
}

module.exports = dbConfig[process.env.NODE_ENV]