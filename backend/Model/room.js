const moment = require('moment')
module.exports = (connection) => {
  return {
    async getAll(lab_name) {
      let [rows, fields] = await connection.execute("select * from room where lab_name = ?", [lab_name])
      return rows
    },
    async add(lab_name, {
      address,
      area
    }) {
      let [result] = await connection.execute("insert into room set address = ?,area = ?, lab_name = ?", [
        address,area,lab_name
      ])
      if (!result) {
        throw new Error('插入错误')
      }
      let room_id = result.insertId
      return room_id
    },
    async delete(room_id) {
      await connection.execute("delete from room where id = ?", [room_id])
    },
    async update(room_id, {
      address,
      area
    }) {
      let tmp = moment(dead_line).toDate()
      await connection.execute("update room set address=?, area = ? where id = ?", [address,area,room_id])
    }
  }
}