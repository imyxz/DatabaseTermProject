const moment = require('moment')
module.exports = (connection) => {
  return {
    async getAll(project_id) {
      let [rows, fields] = await connection.execute("select *,\
      (select name from researcher where researcher.id = w.incharger_id) as incharger_name from work w,project_work where project_work.project_id = ? and w.id = project_work.work_id order by w.sequence asc", [project_id])
      return rows
    },
    async add(project_id, {
      dead_line,
      money,
      requirement,
      sequence,
      incharger_id
    }) {
      let tmp = moment(dead_line).toDate()
      let [result] = await connection.execute("insert into work set dead_line =?, money=?,requirement=?,sequence=?,incharger_id=?", [
        tmp, money, requirement, sequence, incharger_id
      ])
      if (!result) {
        throw new Error('插入错误')
      }
      let work_id = result.insertId
      await connection.execute("insert into project_work set project_id = ?, work_id=?", [project_id, work_id])
      return work_id
    },
    async delete(project_id, work_id) {
      await connection.execute("delete from project_work where project_id = ? and work_id = ?", [project_id, work_id])
      await connection.execute("delete from work where id = ?", [work_id])
    },
    async update(work_id, {
      dead_line,
      money,
      requirement,
      sequence,
      incharger_id
    }) {
      let tmp = moment(dead_line).toDate()
      await connection.execute("update work set  dead_line =?, money=?,requirement=?,sequence=?,incharger_id=? where work_id = ?", [tmp,
        money,
        requirement,
        sequence,
        incharger_id,
        work_id
      ])
    }
  }
}