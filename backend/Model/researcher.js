module.exports = (connection) => {
  return {
    async getAllResearcher(start, limit) {
      let [rows, fields] = await connection.execute("select * from researcher order by id desc limit ?,?", [start, limit])
      return rows
    },
    async search(keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from researcher where name like ? order by id desc limit ?,?", [keyword,start, limit])
      return rows
    },
    async getResearcherCount(){
      let [result] = await connection.execute("select count(*) from researcher")
      return result[0]['count(*)']
    },
    async getResearcherById(id) {
      let [rows, fields] = await connection.execute("select * from researcher where id = ? limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async createResearcher(name,sex,age,title,major,lab_name){
      let [result] = await connection.execute("insert into researcher set name = ?, sex=?,age =?, title=?,major=?,lab_name =?",[name,sex,age,title,major,lab_name])
      if(result && result.warningStatus === 0)
      {
        return result.insertId
      }
      else {
        return false
      }
    },
    async updateResearcher(id,name,sex,age,title,major,lab_name){
      let [result] = await connection.execute("update researcher set name = ?, sex=?,age =?, title=?,major=?,lab_name =? where id = ?",[name,sex,age,title,major,lab_name,id])
    },
    async del(id)
    {
      await connection.execute("delete from researcher where id = ?",[id])
    }
  }
}