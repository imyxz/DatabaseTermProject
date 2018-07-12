<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{name}}</span>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="del(scope.$index)">删除</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  props: ['name', 'cols', 'dataFetchUrl', 'dataFetchProp', 'dataSaveUrl'],
  /*
    col{
      prop,
      label,
      filter,
    }
  */
  data() {
    return {
      fetchedData: [],
      loading: false
    }
  },
  methods: {
    async loadData() {
      let { data } = await this.$axios.get(this.dataFetchUrl)
      this.fetchedData = data[this.dataFetchProp]
    },
    del(index) {
      this.fetchedData.splice(index, 1)
    }
  },
  computed: {
    tableData() {
      return this.fetchedData
    }
  },
  created() {
    this.$on('add', (context) => {
      let tmp = JSON.parse(JSON.stringify(context))
      this.fetchedData.push(tmp)
    })
    this.$on('save', () => {
      this.$axios.post(this.dataSaveUrl, this.fetchedData).then(e => {
        if (e.data.status == 0) {
          this.$notify.success({
            'title': '成功',
            'message': "保存成功"
          })
        }
        else {
          this.$notify.error({
            'title': '失败',
            'message': e.data.err_msg
          })
        }
      })
    })
    this.loadData()
  }
}
</script>

