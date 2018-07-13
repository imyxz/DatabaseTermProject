const moment = require('moment')
module.exports = (connection) => {
  return {
    async getAll(organization_id) {
      let [rows, fields] = await connection.execute("select outer_person.* from outer_person,organization_contractor where organization_contractor.organization_id = ? and outer_person.id = organization_contractor.contractor_id ", [organization_id])
      return rows
    },
    async add(organization_id, {
      name,
      office_phone,
      telephone,
      email
    }) {
      let [result] = await connection.execute("insert into outer_person set name=?,office_phone=?,telephone=?,email=?", [
        name,
      office_phone,
      telephone,
      email
      ])
      return result.insertId
    },
    async setContractor(organization_id,person_id){
      await connection.execute("insert into organization_contractor set organization_id = ?,contractor_id=?",[organization_id,person_id])
    },
    async setIncharger(organization_id,person_id){
      await connection.execute("update organization set incharger_id = ? where id = ?",[person_id,organization_id])
    },
    async getIncharger(organization_id){
      let[rows] = await connection.execute("select outer_person.* from outer_person, organization where organization.id = ? and outer_person.id = organization.incharger_id",[organization_id])
      if(rows.length === 0)
        return false
      else
        return rows[0]
    },
    async delete(person_id) {
      await connection.execute("delete from outer_person where id = ?", [person_id])
    },
    async update(person_id, {
      name,
      office_phone,
      telephone,
      email
    }) {
      let [result] = await connection.execute("update outer_person set name=?,office_phone=?,telephone=?,email=? where id = ?", [
        name,
      office_phone,
      telephone,
      email,
      person_id
      ])
    }
  }
}