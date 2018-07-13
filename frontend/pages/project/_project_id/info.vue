<template>
  <div class="page-container">
    <create-modal :update="true" :id="project_id" ref="create_modal"></create-modal>
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project' }">科研项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{project.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>项目名称：{{project.name}}</p>
      <p>研究内容：{{project.research_content}}</p>
      <p>经费：{{project.money}}</p>
      <p>研究所：{{project.lab_name}}</p>
      <p>负责人：{{project.incharger_name}}</p>
      <p>委托方：{{project.principal_name}}</p>
      <p>质检方：{{project.checker_name}}</p>
      <p>截至时间：{{project.dead_line}}</p>
      <el-button type="primary" @click="openModal()">修改</el-button>
      <el-button type="danger" @click="del()">删除</el-button>
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
    <el-row class="panel">
      <editable-list v-bind="partOptions" ref="part_list"></editable-list>
      <el-row class="border">
        <el-col :span="4">
          <search-selector v-model="newPart.id" placeholder="搜索机构" searchUrl="/api/organization/search?keyword=" searchProp="organizations" searchValue="id" searchLabel="name"></search-selector>
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
import CreateModal from '~/components/CreateProjectModal'
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
      newPart: {
        id: ''
      },
      project: {
        id: '',
        name: '',
        lab_name: '',
        research_content: '',
        money: '',
        start_time: '',
        dead_line: ''
      }
    }
  },
  computed: {
    researcherkSearchUrl() {
      return `/api/lab/${encodeURIComponent(this.project.lab_name)}/researcher/search?keyword=`
    },
    workOptions() {
      let that = this
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
        editable: true,
        viewable: true,
        onView: function(row){
          return '/project/' + that.project_id + '/work/' + row.id +'/info'
        }
      }
    },
    partOptions() {
      return {
        name: '合作伙伴',
        cols: [{
          prop: 'id',
          label: '编号',
          filter: '',
        },
        {
          prop: 'name',
          label: '机构名称',
          filter: '',
        }],
        dataFetchUrl: '/api/project/' + this.project_id + '/partner/all',
        dataFetchProp: 'partners',
        dataSaveUrl: '/api/project/' + this.project_id + '/partner/save',
        editable: true
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
    addWork() {
      this.newWork.incharger_name = this.newWork.incharger_id
      this.newWork.dead_line = this.newWork.dead_line.toString()
      this.$refs.work_list.$emit('add', this.newWork)
    },
    saveWork() {
      this.$refs.work_list.$emit('save', () => {
        location.reload()
      })
    },
    addPart() {
      this.$refs.part_list.$emit('add', this.newPart)
    },
    savePart() {
      this.$refs.part_list.$emit('save', () => {
        location.reload()
      })
    },
    async del() {
      let { data } = await this.$axios.post(`/api/project/${this.project_id}/delete/`)
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.$router.push('/project')
      }
      else {
        this.$notify.error({
          title: '失败',
          message: data.err_msg
        })
      }

    },
    openModal() {
      this.$refs.create_modal.$emit('open')
      this.$refs.create_modal.$on('added', () => {
        location.reload()
      })
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
