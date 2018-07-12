<template>
  <div class="page-container">
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>科研人员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <editable-list v-bind="workOptions" ref="work_list"></editable-list>
      <el-row class="border">
        <el-col :span="4">
          <el-input v-model="newWork.requirement" placeholder="要求"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="newWork.sequence" placeholder="序号"></el-input>
        </el-col>
        <el-col :span="4">
          <el-date-picker v-model="newWork.dead_line" type="datetime" placeholder="完成时间" />
        </el-col>
        <el-col :span="4">
          <search-selector v-model="newWork.incharger_id" placeholder="搜索负责人" :searchUrl="researcherkSearchUrl" searchProp="researchers" searchValue="id" searchLabel="name"></search-selector>
        </el-col>
        <el-col :span="4">
          <el-input v-model="newWork.money" placeholder="经费"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addWork">添加</el-button>
          <el-button @click="saveWork">保存</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
    </el-row>
    <create-modal ref="create_modal"></create-modal>
  </div>
</template>
<script>
import CreateModal from '~/components/CreateResearcherModal'
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      newWork: {
        requirement: '',
        sequence: '',
        dead_line: '',
        incharger_id: '',
        money: ''
      },
      project: {
        id: '',
        name: '',
        lab_name: ''
      }
    }
  },
  computed: {
    researcherkSearchUrl() {
      return `/api/lab/${encodeURIComponent(this.project.lab_name)}/researcher/search?keyword=`
    },
    workOptions() {
      return {
        name: '子课题',
        cols: [{
          prop: 'id',
          label: '编号',
          filter: '',
        },
        {
          prop: 'requirement',
          label: '要求',
          filter: '',
        },
        {
          prop: 'sequence',
          label: '序号',
          filter: '',
        }, {
          prop: 'dead_line',
          label: '完成时间',
          filter: '',
        }, {
          prop: 'money',
          label: '经费',
          filter: '',
        }, {
          prop: 'incharger_name',
          label: '负责人',
          filter: '',
        }],
        dataFetchUrl: '/api/project/' + this.project_id + '/work/all',
        dataFetchProp: 'works',
        dataSaveUrl: '/api/project/' + this.project_id + '/work/save',
      }
    },
    project_id() {
      return this.$route.params.project_id
    }
  },
  mounted() {
    this.loadProject()
  },
  methods: {
    async loadProject() {
      let { data } = await this.$axios.get(`/api/project/${this.project_id}/info/`)
      this.project = data.project
    },
    addWork(){
      this.newWork.incharger_name = this.newWork.incharger_id
      this.newWork.dead_line = this.newWork.dead_line.toString()
      this.$refs.work_list.$emit('add',this.newWork)
    },
    saveWork(){
      this.$refs.work_list.$emit('save')
    }
  },
  watch: {
  },
  components: {
    CreateModal,
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
