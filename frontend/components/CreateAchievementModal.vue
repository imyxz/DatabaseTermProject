<template>
  <el-dialog title="添加科研成果" :visible.sync="dialogVisible" width="330px" class="modal-container" :append-to-body="true">
    <el-row v-loading="loading">
      <el-input placeholder="" v-model="name" class="form-input">
        <template slot="prepend">成果名</template>
      </el-input>
      <el-row type="flex" class="margin-10">
        <span class="prepand">类型</span>
        <el-select v-model="type" placeholder="请选择类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-row type="flex" class="margin-10">
        <span class="prepand" style="width: 42px;">科研项目</span>
        <el-select v-model="project" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="loadProjects" :loading="project_loading">
          <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-row type="flex" class="margin-10">
        <span class="prepand" style="width: 56px;">取得时间</span>
        <el-date-picker v-model="time" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-row>
      <el-row type="flex" class="margin-10">
        <span class="prepand">排名</span>
        <el-input-number v-model="rank" :min="1">
        </el-input-number>
      </el-row>
      <el-row type="flex" justify="end" style="margin-top: 10px;">
        <el-button type="success" round @click="create">{{this.update===true?'更新':'创建'}}</el-button>
      </el-row>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  props: ['update', 'id'],
  data: () => {
    return {
      dialogVisible: false,
      name: '',
      time: '',
      rank: '',
      project: '',
      type: '',
      loading: false,
      project_loading: false,
      researcher_loading: false,
      projects: [],
      researchers: []
    }
  },
  computed: {
    typeOptions() {
      return [{
        label: '论文',
        value: 'paper'
      }, {
        label: '软件著作权',
        value: 'software'
      }, {
        label: '专利-发明',
        value: 'patent_invention'
      }, {
        label: '专利-实用新型',
        value: 'patent_utility'
      }, {
        label: '专利-外观',
        value: 'patent_design'
      }
      ]
    },
    projectOptions() {
      return this.projects.map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    },
    researcherOptions() {
      return this.researchers.map(e => {
        return {
          label: e.name,
          value: e.id
        }
      })
    }
  },
  mounted() {
    this.$on('open', () => {
      this.dialogVisible = true
    })
    this.$on('close', () => {
      this.dialogVisible = false
    })
    this.loadProjects('')
    if (this.update) {
      this.loadData(this.id)
    }
  },
  methods: {
    async create() {
      let target = this.update === true ? `/api/achievement/${this.id}/update` : '/api/achievement/create'

      let { data } = await this.$axios.post(target, {
        name: this.name,
        time: this.time,
        rank: this.rank,
        project: this.project,
        type: this.type,
      })
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '添加科研成果成功'
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
    async loadProjects(keyword) {
      let { data } = await this.$axios.get('/api/project/search?keyword=' + encodeURIComponent(keyword))
      this.project_loading = true
      if (data.status === 0) {
        this.projects = data.projects
        this.project_loading = false
      }
      else {
        this.$notify.error({
          title: '失败',
          message: data.err_msg
        })
      }
    },
    async loadResearchers(keyword) {
      let { data } = await this.$axios.get('/api/researcher/search?keyword=' + encodeURIComponent(keyword))
      this.researcher_loading = true
      if (data.status === 0) {
        this.researchers = data.researchers
        this.researcher_loading = false
      }
      else {
        this.$notify.error({
          title: '失败',
          message: data.err_msg
        })
      }
    },
    async loadData(id) {
      let { data } = await this.$axios.get(`/api/achievement/${id}/info`)
      let that = this
      Object.getOwnPropertyNames(data.achievement).forEach(e => {
        if (that[e] !== undefined)
          that[e] = data.achievement[e]
      })
    }
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
    width: 28px;
    line-height: 38px;
  }
  .margin-10 {
    margin-bottom: 10px;
  }
}
</style>
