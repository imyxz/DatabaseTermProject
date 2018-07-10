module.exports = (connection) => {
  return {
    async checkLogin(username,password){
      let [rows, fields] = await connection.execute("select * from user where username = ? and password = md5(?) limit 1",[username, password])
      if(rows.length>0)
        return rows[0]
      else
        return false
    }
  }
}