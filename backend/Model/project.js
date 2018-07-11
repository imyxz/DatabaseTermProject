module.exports = (connection) => {
  return {
    async getAllProject(start, limit) {
      let [rows, fields] = await connection.execute("select *,(select count(*) from project_work where project_work.project_id = p.id) as work_count from project p order by id desc limit ?,?", [start, limit])
      return rows
    },
    async search(keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from project where name like ? order by id desc limit ?,?", [keyword,start, limit])
      return rows
    },
    async getProjectCount(){
      let [result] = await connection.execute("select count(*) from project")
      return result[0]['count(*)']
    },
    async getProjectById(id) {
      let [rows, fields] = await connection.execute("select * from project where id = ? limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async getProjectPartners(id) {
      let [rows, fields] = await connection.execute("select organization.* from organization,project_partner where project_partner.project_id = ? and organization.id = project_partner.partner_id order by organization.id desc", [id])
      return rows
    },
    async getProjectChecker(id) {
      let [rows, fields] = await connection.execute("select * from organization,project where project.project_id = ? and organization.id = project.check_id limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async getProjectPrincipal(id) {
      let [rows, fields] = await connection.execute("select * from organization,project where project.project_id = ? and organization.id = project.principal_id limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    }, 
    async createProject(name,research_content,money,start_time,dead_line){
      let [result] = await connection.execute("insert into project set name = ?, research_content = ?, money = ?, start_time = ?, dead_line = ?",[name,research_content,money,start_time,dead_line])
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