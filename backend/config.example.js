module.exports = {
  server:{
    port: 3876,
    prefix: '/'
  },
  database: {
    username: '',
    password: '',
    host: '',
    db_name: ''
  },
  env: {
    JWTKEY: '',
    session_secret: ''
  },
  dev: {
    hotSwap: true,
    showDBLog: true
  }
}