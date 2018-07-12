<template>
  <div class="page-container">
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>研究所管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="large-button">
          <div class="panel">
            <div>
              <i class="el-icon-search"></i>
              <p>搜索研究所</p>
              <el-select v-model="search_keyword" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="search" :loading="search_loading">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="large-button" @click="openCreateModal()">
          <div class="panel">
            <div>
              <i class="el-icon-plus"></i>
              <span>添加研究所</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18" :offset="1" class="panel">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="名称" width="180">
          </el-table-column>
          <el-table-column prop="instruction" label="介绍" width="180">
          </el-table-column>
          <el-table-column prop="room_count" label="办公场所">
          </el-table-column>
          <el-table-column prop="researcher_count" label="科研人员">
          </el-table-column>
          <el-table-column prop="project_count" label="项目">
          </el-table-column>
          <el-table-column prop="incharger" label="负责人">
          </el-table-column>
          <el-table-column prop="secretary" label="秘书">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="pagination">
          <el-pagination background layout="prev, pager, next" :total="total" :page-size="page_size" :current-page.sync="page"></el-pagination>
        </el-row>
      </el-col>
    </el-row>
    <create-modal ref="create_modal"></create-modal>
  </div>
</template>
<script>
import CreateModal from '~/components/CreateLabModal'
export default {
  data() {
    return {
      labs: [],
      total: 0,
      page_size: 10,
      page: 1,
      loading: false,
      search_items: [],
      search_keyword: '',
      search_loading: false
    }
  },
  computed: {
    tableData() {
      return this.labs
    },
    searchOptions() {
      return this.search_items.map(e => {
        return {
          value: e.name,
          label: e.name
        }
      })
    }
  },
  mounted() {
    this.$refs.create_modal.$on('added', () => {
      this.page = 1
      this.loadData()
    })
    this.loadData()
    this.search('')
  },
  methods: {
    async loadData(page = 1) {
      this.loading = true
      let result = await this.$axios.get(`/api/lab/all?page=${page}`)
      this.labs = result.data.labs
      if (result.data.total)
        this.total = result.data.total
      this.loading = false
    },
    openCreateModal() {
      this.$refs.create_modal.$emit('open')
    },
    async search(keyword) {
      let { data } = await this.$axios.get('/api/lab/search?keyword=' + encodeURIComponent(keyword))
      this.search_loading = true
      if (data.status === 0) {
        this.search_items = data.labs
        this.search_loading = false
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
    page(newVal) {
      this.loadData(newVal)
    },
    search_keyword(newVal) {
      this.$router.push(`/lab/${encodeURIComponent(newVal)}/info`)
    }
  },
  components: {
    CreateModal
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


