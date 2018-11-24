<template>
  <div class="page-container">
    <create-modal :update="true" :id="lab_id" ref="create_modal"></create-modal>
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/laboratory' }">研究室管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{lab.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>名称：{{lab.name}}</p>
      <p>介绍：{{lab.instruction}}</p>
      <p>秘书：{{lab.secretary_name}}</p>
      <el-button type="primary" @click="openModal()">修改</el-button>
      <el-button type="danger" @click="del()">删除</el-button>
    </el-row>
    <el-row class="panel">
      <editable-list v-bind="roomOptions" ref="room_list"></editable-list>
      <el-row class="border">
        <el-col :span="4">
          <el-input v-model="newRoom.address" placeholder="地址"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="newRoom.area" placeholder="面积"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addRoom">添加</el-button>
          <el-button @click="saveRoom">保存</el-button>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import CreateModal from '~/components/CreateLabModal'
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      newRoom: {
        address: '',
        area: '',
        id: ''
      },
      lab: {
        name: '',
        instruction: '',
        sec_id: '',
        secretary_id: ''
      }
    }
  },
  computed: {
    roomOptions() {
      return {
        name: '办公场所',
        cols: [{
          prop: 'id',
          label: '编号',
          filter: '',
        },
        {
          prop: 'address',
          label: '地址',
          filter: '',
        },
        {
          prop: 'area',
          label: '面积',
          filter: '',
        }],
        dataFetchUrl: '/api/lab/' + this.lab_id + '/room/all',
        dataFetchProp: 'rooms',
        dataSaveUrl: '/api/lab/' + this.lab_id + '/room/save',
        editable: true
      }
    },
    lab_id() {
      return this.$route.params.lab_id
    }
  },
  mounted() {
    this.loadLab()
  },
  methods: {
    async loadLab() {
      let { data } = await this.$axios.get(`/api/lab/${this.lab_id}/info/`)
      this.lab = data.lab
    },
    addRoom() {
      this.$refs.room_list.$emit('add', this.newRoom)
    },
    saveRoom() {
      this.$refs.room_list.$emit('save', () => {
        this.loadLab()
      })
    },
    async del() {
      let { data } = await this.$axios.post(`/api/lab/${this.lab_id}/delete/`)
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.$router.push('/laboratory')
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
        this.loadLab()
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
