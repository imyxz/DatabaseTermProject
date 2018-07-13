<template>
  <el-dialog title="添加科研人员" :visible.sync="dialogVisible" width="330px" class="modal-container" :append-to-body="true">
    <el-row v-loading="loading">
      <el-input placeholder="" v-model="name" class="form-input">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-row type="flex" class="margin-10">
        <span class="prepand">性别</span>
        <el-select v-model="sex" placeholder="请选择性别">
          <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-input placeholder="" v-model="title" class="form-input">
        <template slot="prepend">职称</template>
      </el-input>
      <el-row type="flex" class="margin-10">
        <span class="prepand">年龄</span>
        <el-input-number v-model="age" :min="1" label="年龄"></el-input-number>
      </el-row>
      <el-input placeholder="" v-model="major" class="form-input">
        <template slot="prepend">研究方向</template>
      </el-input>
      <el-row type="flex" class="margin-10">
        <span class="prepand" style="width: 42px;">研究所</span>
        <el-select v-model="lab" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="loadLabs" :loading="lab_loading">
          <el-option v-for="item in labOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
      sex: '',
      title: '',
      age: 18,
      major: '',
      lab: '',
      laboratories: [],
      loading: false,
      lab_loading: false
    }
  },
  computed: {
    sexOptions() {
      return [{
        label: '男',
        value: 'male'
      }, {
        label: '女',
        value: 'female'
      }, {
        label: '保密',
        value: 'secret'
      }
      ]
    },
    labOptions() {
      return this.laboratories.map(e => {
        return {
          value: e.name,
          label: e.name
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
    this.loadLabs('')
    if (this.update) {
      this.loadData(this.id)
    }
  },
  methods: {
    async create() {
      let target = this.update === true ? `/api/researcher/${this.id}/update` : '/api/researcher/create'

      let { data } = await this.$axios.post(target, {
        name: this.name,
        sex: this.sex,
        title: this.title,
        age: this.age,
        major: this.major,
        lab: this.lab
      })
      if (data.status === 0) {
        this.$notify.success({
          title: '成功',
          message: '添加科研人员成功'
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
    async loadLabs(keyword) {
      let { data } = await this.$axios.get('/api/lab/search?keyword=' + encodeURIComponent(keyword))
      this.lab_loading = true
      if (data.status === 0) {
        this.laboratories = data.labs
        this.lab_loading = false
      }
      else {
        this.$notify.error({
          title: '失败',
          message: data.err_msg
        })
      }
    },
    async loadData(id) {
      let { data } = await this.$axios.get(`/api/researcher/${id}/info`)
      let that = this
      Object.getOwnPropertyNames(data.researcher).forEach(e => {
        if (that[e] !== undefined)
          that[e] = data.researcher[e]
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
