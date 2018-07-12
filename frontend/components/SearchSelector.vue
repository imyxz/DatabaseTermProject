<template>
  <el-select v-model="val" filterable remote reserve-keyword :placeholder="placeholder" :remote-method="search" :loading="search_loading">
    <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: ['value','placeholder','searchUrl','searchProp','searchValue','searchLabel'],
  data(){
    return {
      val: this.value,
      search_loading: false,
      search_items: []
    }
  },
  watch:{
    val(newVal){
      this.$emit('input',newVal)
    },
    searchUrl(newVal){
      this.search('').catch()
    }
  },
  methods:{
    async search(keyword) {
      let { data } = await this.$axios.get(this.searchUrl + encodeURIComponent(keyword))
      this.search_loading = true
      if (data.status == 0) {
        this.search_items = data[this.searchProp]
        this.search_loading = false
      }
      else {
      }
    }
  },
  mounted(){
    this.search('').catch()
  },
  computed:{
    searchOptions() {
      return this.search_items.map(e => {
        return {
          value: e[this.searchValue],
          label: e[this.searchLabel]
        }
      })
    }
  }

}
</script>

