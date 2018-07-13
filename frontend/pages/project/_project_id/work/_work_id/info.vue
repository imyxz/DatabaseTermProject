<template>
  <div class="page-container">
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project' }">科研项目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/' + project_id + '/info' }">{{project.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{work.id}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>所属项目：{{project.name}}</p>
      <p>编号：{{work.id}}</p>
      <p>要求：{{work.requirement}}</p>
      <p>截止时间：{{work.dead_line}}</p>
      <p>经费：{{work.money}}</p>
      <p>序号：{{work.sequence}}</p>
      <p>负责人：{{work.incharger_name}}</p>
    </el-row>
    <el-row class="panel">
      <editable-list v-bind="researcherOptions" ref="researcher_list"></editable-list>
      <el-row class="border">
        <el-col :span="4">
          <search-selector v-model="newResearcher.id" placeholder="搜索科研人员" :searchUrl="researcherkSearchUrl" searchProp="researchers" searchValue="id" searchLabel="name"></search-selector>
        </el-col>
        <el-col :span="4">
          <el-button @click="addPart">添加</el-button>
          <el-button @click="savePart">保存</el-button>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      newResearcher: {
        id: ''
      },
      work: {
        id: '',
        dead_line: '',
        money: '',
        requirement: '',
        sequence: '',
        incharger_name: ''
      },
      project: {
        lab_name: ''
      }
    }
  },
  computed: {
    researcherkSearchUrl() {
      return `/api/lab/${encodeURIComponent(this.project.lab_name)}/researcher/search?keyword=`
    },
    researcherOptions() {
      return {
        name: '参与者',
        cols: [{
          prop: 'id',
          label: '编号',
          filter: '',
        },
        {
          prop: 'name',
          label: '姓名',
          filter: '',
        }],
        dataFetchUrl: '/api/project/'+ this.project_id+'/work/' + this.work_id + '/researcher/all',
        dataFetchProp: 'researchers',
        dataSaveUrl: '/api/project/'+ this.project_id+'/work/' + this.work_id + '/researcher/save',
        editable: true
      }
    },
    work_id() {
      return this.$route.params.work_id
    },
    project_id() {
      return this.$route.params.project_id
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let { data } = await this.$axios.get(`/api/project/${this.project_id}/work/${this.work_id}/info/`)
      this.work = data.work
      let { data: _data } = await this.$axios.get(`/api/project/${this.project_id}/info/`)
      this.project = _data.project
    },
    addPart() {
      this.$refs.researcher_list.$emit('add', this.newResearcher)
    },
    savePart() {
      this.$refs.researcher_list.$emit('save', () => {
        location.reload()
      })
    },
  },
  watch: {
  },
  components: {
    EditableList,
    SearchSelector
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  max-width: 1300px;
  height: 100%;
  margin: 0 auto;
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .large-button {
    padding-bottom: 100%;
    position: relative;
    > div {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      i {
        font-size: 80px;
        color: #409eff;
      }
      * {
        font-size: 20px;
        display: block;
      }
    }
  }
}
</style>
