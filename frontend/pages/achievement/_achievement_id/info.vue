<template>
  <div class="page-container">
    <create-modal :update="true" :id="achievement_id" ref="create_modal"></create-modal>
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/achievement' }">科研成果管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{achievement.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>成果名：{{achievement.name}}</p>
      <p>类型：{{achievement._type}}</p>
      <p>科研项目：{{project.name}}</p>
      <p>取得时间：{{achievement.time}}</p>
      <p>排名：{{achievement.rank}}</p>
      <el-button @click="openModal()" type="primary">修改</el-button>
      <el-button type="danger" @click="del()">删除</el-button>
    </el-row>
    <el-row class="panel">
      <editable-list v-bind="partOptions" ref="part_list"></editable-list>
      <el-row class="border">
        <el-col :span="4">
          <search-selector v-model="newResearcher.id" placeholder="搜索贡献人" :searchUrl="researcherkSearchUrl" searchProp="researchers" searchValue="id" searchLabel="name"></search-selector>
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
import CreateModal from '~/components/CreateAchievementModal'
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      newResearcher: {
        id: ''
      },
      achievement: {
        id: '',
        name: '',
        lab_name: '',
        research_content: '',
        money: '',
        start_time: '',
        dead_line: ''
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
    partOptions() {
      return {
        name: '贡献人',
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
        dataFetchUrl: '/api/achievement/' + this.achievement_id + '/part/all',
        dataFetchProp: 'parts',
        dataSaveUrl: '/api/achievement/' + this.achievement_id + '/part/save',
        editable: true
      }
    },
    achievement_id() {
      return this.$route.params.achievement_id
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const relation = {
        'paper': '论文',
        'software': '软件著作权',
        'patent_invention': '专利-发明',
        'patent_utility': '专利-实用新型',
        'patent_design': '专利-外观'
      }
      let { data } = await this.$axios.get(`/api/achievement/${this.achievement_id}/info/`)
      this.achievement = data.achievement
      this.achievement._type = relation[data.achievement.type]
      let { data: _data } = await this.$axios.get(`/api/project/${data.achievement.project_id}/info/`)
      this.project = _data.project
    },
    addPart() {
      this.$refs.part_list.$emit('add', this.newResearcher)
    },
    savePart() {
      this.$refs.part_list.$emit('save', () => {
        location.reload()
      })
    },
    openModal() {
      this.$refs.create_modal.$emit('open')
      this.$refs.create_modal.$on('added', () => {
        location.reload()
      })
    },
    async del() {
      let { data } = await this.$axios.post(`/api/achievement/${this.achievement_id}/delete/`)
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.$router.push('/achievement')
      }
      else {
        this.$notify.error({
          title: '失败',
          message: data.err_msg
        })
      }

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
