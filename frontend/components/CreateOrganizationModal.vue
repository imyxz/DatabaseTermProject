<template>
  <el-dialog title="外部机构" :visible.sync="dialogVisible" width="500px" class="modal-container" :append-to-body="true">
    <el-row v-loading="loading">
      <el-input placeholder="" v-model="name" class="form-input">
        <template slot="prepend">名称</template>
      </el-input>
      <el-input placeholder="" v-model="address" class="form-input">
        <template slot="prepend">地址</template>
      </el-input>
      <el-row type="flex" justify="end" style="margin-top: 10px;">
        <el-button type="success" round @click="create">{{this.update===true?'更新':'创建'}}</el-button>
      </el-row>
    </el-row>
  </el-dialog>
</template>
<script>
import SearchSelector from '~/components/SearchSelector'
export default {
  props: ['update','id'],
  components: {
    SearchSelector
  },
  data: () => {
    return {
      dialogVisible: false,
      name: '',
      address: '',
      loading: false
    }
  },
  mounted() {
    this.$on('open', () => {
      this.dialogVisible = true
      if(this.update)
      {
        this.loadData(this.id)
      }
    })
    this.$on('close', () => {
      this.dialogVisible = false
    })
  },
  methods: {
    async create() {
      let target = this.update === true?`/api/organization/${encodeURIComponent(this.id)}/update` : '/api/organization/create'
      let { data } = await this.$axios.post(target, {
        name: this.name,
        address: this.address
      })
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '创建成功'
        })
        this.dialogVisible = false
        this.$emit('added')
      }
      else {
        this.$notify.error({
          title: '失败',
          message: data.err_msg
        })
      }
    },
    async loadData(id){
      let {data} = await this.$axios.get( `/api/organization/${encodeURIComponent(id)}/info`)
      let that = this
      Object.getOwnPropertyNames(data.organization).forEach(e => {
        if(that[e] !== undefined)
          that[e] = data.organization[e]
      })

    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
.modal-container {
  .form-input {
    margin: 10px 0;
  }
  .prepand {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    white-space: nowrap;
    height: 38px;
    width: 56px;
    line-height: 38px;
  }
  .margin-10 {
    margin-bottom: 10px;
  }
}
</style>
