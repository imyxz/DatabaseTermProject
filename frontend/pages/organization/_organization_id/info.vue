<template>
  <div class="page-container">
    <create-modal :update="true" :id="organization_id" ref="create_modal"></create-modal>
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/organization' }">机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{organization.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="panel">
      <p>名称：{{organization.name}}</p>
      <p>地址：{{organization.address}}</p>
      <p>负责人：{{organization.incharger_name}}</p>
      <el-button type="primary" @click="openModal()">修改</el-button>
      <el-button type="danger" @click="del()">删除</el-button>
    </el-row>
    <el-row class="panel">
      <editable-list v-bind="personOptions" ref="person_list"></editable-list>
      <el-row class="border">
        <el-col :span="4">
          <el-input v-model="newPerson.name" placeholder="姓名"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="newPerson.office_phone" placeholder="办公电话"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="newPerson.telephone" placeholder="手机"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="newPerson.email" placeholder="电子邮件"></el-input>
        </el-col>
        <el-col :span="4" style="display: flex;align-items: center; justify-content: center;">
          <el-checkbox v-model="is_incharger" style="font-size: 25px;">负责人</el-checkbox>
        </el-col>
        <el-col :span="4">
          <el-button @click="addPerson">添加</el-button>
          <el-button @click="savePerson">保存</el-button>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import CreateModal from '~/components/CreateOrganizationModal'
import EditableList from '~/components/EditableList'
import SearchSelector from '~/components/SearchSelector'
export default {
  data() {
    return {
      newPerson: {
        name: '',
        office_phone: '',
        telephone: '',
        email: '',
        type: '',
      },
      organization: {
        name: '',
        address: ''
      },
      is_incharger: false
    }
  },
  computed: {
    personOptions() {
      return {
        name: '机构人员',
        cols: [{
          prop: 'id',
          label: '编号',
          filter: '',
        },{
          prop: 'name',
          label: '姓名',
          filter: '',
        },{
          prop: 'office_phone',
          label: '办公电话',
          filter: '',
        },
        {
          prop: 'telephone',
          label: '手机',
          filter: '',
        },{
          prop: 'email',
          label: '电子邮箱',
          filter: '',
        },{
          prop: 'type',
          label: '身份',
          filter: '',
        },],
        dataFetchUrl: '/api/organization/' + this.organization_id + '/person/all',
        dataFetchProp: 'persons',
        dataSaveUrl: '/api/organization/' + this.organization_id + '/person/save',
        editable: true
      }
    },
    organization_id() {
      return this.$route.params.organization_id
    }
  },
  mounted() {
    this.loadOrganization()
  },
  methods: {
    async loadOrganization() {
      let { data } = await this.$axios.get(`/api/organization/${this.organization_id}/info/`)
      this.organization = data.organization
    },
    addPerson() {
      this.newPerson.type = this.is_incharger === true ? 'incharger' : 'contractor'
      this.$refs.person_list.$emit('add', this.newPerson)
    },
    savePerson() {
      this.$refs.person_list.$emit('save', () => {
        this.loadOrganization()
      })
    },
    async del() {
      let { data } = await this.$axios.post(`/api/organization/${this.organization_id}/delete/`)
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.$router.push('/organization')
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
        this.loadOrganization()
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
