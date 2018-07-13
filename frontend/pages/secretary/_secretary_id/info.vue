<template>
  <div class="page-container">
    <create-modal :update="true" :id="secretary_id" ref="create_modal"></create-modal>
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/secretary' }">秘书人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{secretary.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>姓名：{{secretary.name}}</p>
      <p>性别：{{secretary._sex}}</p>
      <p>年龄：{{secretary.age}}</p>
      <p>聘用时间：{{secretary.hired_time}}</p>
      <p>职责：{{secretary.responsibility}}</p>
      <el-button @click="openModal()" type="primary">修改</el-button>
      <el-button type="danger" @click="del()">删除</el-button>
    </el-row>
  </div>
</template>
<script>
import CreateModal from '~/components/CreateSecretaryModal'
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      secretary: {
        id: '',
        name: '',
        sex: '',
        age: '',
        hired_time: '',
        responsibility: ''
      }
    }
  },
  computed: {
    secretary_id() {
      return this.$route.params.secretary_id
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
      let { data } = await this.$axios.get(`/api/secretary/${this.secretary_id}/info/`)
      this.secretary = data.secretary
      this.secretary._sex = relation[data.secretary.sex]
    },
    openModal() {
      this.$refs.create_modal.$emit('open')
      this.$refs.create_modal.$on('added', () => {
        location.reload()
      })
    },
    async del() {
      let { data } = await this.$axios.post(`/api/secretary/${this.secretary_id}/delete/`)
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.$router.push('/secretary')
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
