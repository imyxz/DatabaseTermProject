module.exports = (connection) => {
  return {
    async getAllOrganization(start, limit) {
      let [rows, fields] = await connection.execute("select *,\
      (select name from outer_person where outer_person.id = org.incharger_id) as incharger_name,\
      (select count(*) from project where project.principal_id = org.id) as principal_count,\
      (select count(*) from project where project.checker_id = org.id) as checker_count,\
      (select count(*) from project_partner where project_partner.partner_id = org.id) as partner_count,\
      (select count(*) from organization_contractor where organization_contractor.organization_id = org.id) as contractor_count\
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
    async getOrganizationById(id) {
      let [rows, fields] = await connection.execute("select *,(select name from outer_person where outer_person.id = org.incharger_id) as incharger_name from organization org where org.id = ? limit 1", [id])
      if (rows.length === 0)
        return false
      else
        return rows[0]
    },
    async createOrganization(name,address){
      let [result] = await connection.execute("insert into organization set name = ?, address =?",[name,address])
      if(result && result.warningStatus === 0)
      {
        return result.insertId
      }
      else {
        return false
      }
    },
    async updateOrganization(id,name,address){
      let [result] = await connection.execute("update organization set name = ?, address =? where id=?",[name,address,id])
    },
    async addPartner(project_id,partner_id){
      await connection.execute("insert into project_partner set project_id = ? , partner_id=?",[project_id,partner_id])
    },
    async delAllPartner(project_id){
      await connection.execute("delete from project_partner where project_id = ?",[project_id])
    },
    async getAllPartner(project_id){
      let [rows] = await connection.execute("select organization.* from project_partner,organization where organization.id = project_partner.partner_id and project_partner.project_id = ?",[project_id])
      return rows
    }
  }
}