module.exports = (connection) => {
  return {
    async getAllLab(start, limit) {
      let [rows, fields] = await connection.execute("select *,(select count(*) from room where room.lab_name = lab.name) as room_count,(select count(*) from researcher where researcher.lab_name = lab.name) as researcher_count,(select count(*) from project,researcher where researcher.lab_name = lab.name and project.incharger_id = researcher.id) as project_count from laboratory lab order by name desc limit ?,?", [start, limit])
      return rows
    },
    async searchLab(keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from laboratory where name like ? order by name desc limit ?,?", [keyword,start, limit])
      return rows
    },
    async searchResearcher(lab_name,keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from researcher where lab_name = ? and name like ? order by name desc limit ?,?", [lab_name, keyword,start, limit])
      return rows
    },
    async getLabCount(){
      let [result] = await connection.execute("select count(*) from laboratory")
      return result[0]['count(*)']
    },
    async getLabByName(name) {
      let [rows, fields] = await connection.execute("select * from laboratory where name = ? limit 1", [name])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async createLab(name,sex,age,title,major,lab_name){
      let [result] = await connection.execute("insert into laboratory set name = ?, sex=?,age =?, title=?,major=?,lab_name =?",[name,sex,age,title,major,lab_name])
      if(result && result.warningStatus === 0)
      {
        return result.insertId
      }
      else {
        return false
      }
    }
  }
}