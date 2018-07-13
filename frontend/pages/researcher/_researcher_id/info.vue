<template>
  <div class="page-container">
    <create-modal :update="true" :id="researcher_id" ref="create_modal"></create-modal>
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/researcher' }">科研人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{researcher.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>姓名：{{researcher.name}}</p>
      <p>性别：{{researcher._sex}}</p>
      <p>职称：{{researcher.title}}</p>
      <p>年龄：{{researcher.age}}</p>
      <p>研究方向：{{researcher.major}}</p>
      <p>研究室：{{researcher.lab_name}}</p>
      <el-button @click="openModal()" type="primary">修改</el-button>
      <el-button type="danger" @click="del()">删除</el-button>
    </el-row>
  </div>
</template>
<script>
import CreateModal from '~/components/CreateResearcherModal'
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      researcher: {
        id: '',
        name: '',
        sex: '',
        age: '',
        title: '',
        major: '',
        lab_name: ''
      }
    }
  },
  computed: {
    researcher_id() {
      return this.$route.params.researcher_id
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const relation = {
        'male': '男',
        'female': '女',
        'secret': '保密'
      }
      let { data } = await this.$axios.get(`/api/researcher/${this.researcher_id}/info/`)
      this.researcher = data.researcher
      this.researcher._sex = relation[data.researcher.sex]
    },
    openModal() {
      this.$refs.create_modal.$emit('open')
      this.$refs.create_modal.$on('added', () => {
        location.reload()
      })
    },
    async del() {
      let { data } = await this.$axios.post(`/api/researcher/${this.researcher_id}/delete/`)
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.$router.push('/researcher')
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
