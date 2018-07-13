<template>
  <el-dialog title="研究室" :visible.sync="dialogVisible" width="500px" class="modal-container" :append-to-body="true">
    <el-row v-loading="loading">
      <el-input placeholder="" v-model="name" class="form-input">
        <template slot="prepend">研究室名称</template>
      </el-input>
      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="介绍" v-model="instruction" class="form-input">
      </el-input>
      <el-row type="flex" class="margin-10">
        <span class="prepand" style="width: 42px;">秘书</span>
        <search-selector v-model="sec_id" placeholder="搜索秘书" searchUrl="/api/secretary/search?keyword=" searchProp="secretarys" searchValue="id" searchLabel="name"></search-selector>
      </el-row>
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
      instruction: '',
      sec_id: '',
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
      let target = this.update === true?`/api/lab/${encodeURIComponent(this.id)}/update` : '/api/lab/create'
      let { data } = await this.$axios.post(target, {
        name: this.name,
        instruction: this.instruction,
        sec_id: this.sec_id
      })
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '研究室创建成功'
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
      let {data} = await this.$axios.get( `/api/lab/${encodeURIComponent(id)}/info`)
      let that = this
      Object.getOwnPropertyNames(data.lab).forEach(e => {
        if(that[e] !== undefined)
          that[e] = data.lab[e]
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
