<template>
  <el-dialog title="新建科研项目" :visible.sync="dialogVisible" width="500px" class="modal-container" :append-to-body="true">
    <el-row v-loading="loading">
      <el-input placeholder="" v-model="name" class="form-input">
        <template slot="prepend">项目名称</template>
      </el-input>
      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="研究内容" v-model="research_content" class="form-input">
      </el-input>

      <el-row type="flex" class="margin-10">
        <span class="prepand">项目时间:</span>
        <el-date-picker v-model="time_range" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-row>
      <el-row type="flex" class="margin-10">
        <span class="prepand">项目经费:</span>
        <el-input-number v-model="money" :precision="2" :step="100">
        </el-input-number>
      </el-row>
      <el-row type="flex" class="margin-10">
        <span class="prepand" style="width: 42px;">研究所</span>
        <search-selector v-model="lab_name" placeholder="搜索研究所" searchUrl="/api/lab/search?keyword=" searchProp="labs" searchValue="name" searchLabel="name"></search-selector>
      </el-row>
      <el-row type="flex" justify="end" style="margin-top: 10px;">
        <el-button type="success" round @click="create">创建</el-button>
      </el-row>
    </el-row>
  </el-dialog>
</template>
<script>
import SearchSelector from '~/components/SearchSelector'
export default {
  components:{
    SearchSelector
  },
  data: () => {
    return {
      dialogVisible: false,
      name: '',
      research_content: '',
      money: '',
      time_range: ['', ''],
      lab_name: '',
      loading: false
    }
  },
  mounted() {
    this.$on('open', () => {
      this.dialogVisible = true
    })
    this.$on('close', () => {
      this.dialogVisible = false
    })
  },
  methods: {
    async create() {
      let { data } = await this.$axios.post('/api/project/create', {
        name: this.name,
        research_content: this.research_content,
        money: this.money,
        start_time: this.time_range[0],
        end_time: this.time_range[1],
        lab_name: this.lab_name
      })
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '科研项目创建成功'
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
