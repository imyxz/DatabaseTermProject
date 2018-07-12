module.exports = (connection) => {
  return {
    async getAllAchievement(start, limit) {
      let [rows, fields] = await connection.execute("select *,(select name from project where project.id = ach.project_id limit 1) as project_name,(select count(*) from achievement_participant where achievement_participant.achievement_id = ach.id) as participant_count from achievement ach order by id desc limit ?,?", [start, limit])
      return rows
    },
    async search(keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from achievement where name like ? order by id desc limit ?,?", [keyword,start, limit])
      return rows
    },
    async getAchievementCount(){
      let [result] = await connection.execute("select count(*) from achievement")
      return result[0]['count(*)']
    },
    async getAchievementById(id) {
      let [rows, fields] = await connection.execute("select * from achievement where id = ? limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async createAchievement(name,time,rank,project_id,type){
      let [result] = await connection.execute("insert into achievement set name=?,time=?,rank=?,project_id=?,type=?",[name,time,rank,project_id,type])
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