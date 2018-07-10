<template>
  <div class="page-container">
    <el-row class="panel">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>科研项目管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="large-button">
          <div><i class="el-icon-plus"></i></div>


        </div>
      </el-col>
      <el-col :span="18" :offset="1" class="panel">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="#" width="180">
          </el-table-column>
          <el-table-column prop="name" label="项目名称" width="180">
          </el-table-column>
          <el-table-column prop="research_content" label="研究内容">
          </el-table-column>
          <el-table-column prop="money" label="经费">
          </el-table-column>
          <el-table-column prop="work_count" label="子课题">
          </el-table-column>
          <el-table-column prop="start_time" label="开始时间">
          </el-table-column>
          <el-table-column prop="dead_line" label="截止时间">
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
  </div>

</template>
<script>
export default {
  data() {
    return {
      projects: [],
      total: 0,
      page_size: 10,
      page: 1,
      loading: false
    }
  },
  computed: {
    tableData() {
      return this.projects
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData(page = 1) {
      this.loading = true
      let result = await this.$axios.get(`/api/project/all?page=${page}`)
      this.projects = result.data.projects
      if (result.data.total)
        this.total = result.data.total
      this.loading = false
    }
  },
  watch: {
    page(newVal) {
      this.loadData(newVal)
    }
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
  }
  .large-button{
    padding-bottom: 100%;
    position: relative;
    div{
      position: absolute;
      left:0;
      right: 0;
      bottom: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 100px;
      color: white;
    }
  }
}
</style>


