module.exports = (connection) => {
  return {
    async getAllSecretary(start, limit) {
      let [rows, fields] = await connection.execute("select * from secretary order by id desc limit ?,?", [start, limit])
      return rows
    },
    async search(keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from secretary where name like ? order by id desc limit ?,?", [keyword,start, limit])
      return rows
    },
    async getSecretaryCount(){
      let [result] = await connection.execute("select count(*) from secretary")
      return result[0]['count(*)']
    },
    async getSecretaryById(id) {
      let [rows, fields] = await connection.execute("select * from secretary where id = ? limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async createSecretary(name,sex,age,responsibility,hired_time){
      let [result] = await connection.execute("insert into secretary set name = ?, sex=?,age =?, responsibility=?,hired_time =?",[name,sex,age,responsibility,hired_time])
      if(result && result.warningStatus === 0)
      {
        return result.insertId
      }
      else {
        return false
      }
    },
    async updateSecretary(id,name,sex,age,responsibility,hired_time){
      let [result] = await connection.execute("update secretary set name = ?, sex=?,age =?, responsibility=?,hired_time =? where id = ?",[name,sex,age,responsibility,hired_time,id])

    },
    async del(id)
    {
      await connection.execute("delete from secretary where id = ?",[id])
    }
  }
}