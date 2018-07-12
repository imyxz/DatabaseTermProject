module.exports = (connection) => {
  return {
    async getAllOrganization(start, limit) {
      let [rows, fields] = await connection.execute("select *,\
      (select name from outer_person where outer_person.id = org.incharger_id) as incharger_name,\
      (select count(*) from project where project.principal_id = org.id) as principal_count,\
      (select count(*) from project where project.checker_id = org.id) as checker_count,\
      (select count(*) from project_partner where project_partner.partner_id = org.id) as partner_count\
       from organization org order by id desc limit ?,?", [start, limit])
      return rows
    },
    async searchOrganization(keyword, start, limit) {
      keyword = keyword.replace(/\_/g,'\\\_').replace('/%/g','\\%')
      keyword = '%' + keyword + '%'
      let [rows, fields] = await connection.execute("select * from organization where name like ? order by name desc limit ?,?", [keyword,start, limit])
      return rows
    },
    async getOrganizationCount(){
      let [result] = await connection.execute("select count(*) from organization")
      return result[0]['count(*)']
    },
    async getOrganizationByName(name) {
      let [rows, fields] = await connection.execute("select * from organization where name = ? limit 1", [name])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async createOrganization(name,sex,age,title,major,organization_name){
      let [result] = await connection.execute("insert into organization set name = ?, sex=?,age =?, title=?,major=?,organization_name =?",[name,sex,age,title,major,organization_name])
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