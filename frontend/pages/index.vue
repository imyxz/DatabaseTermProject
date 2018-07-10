<template>
  <div class="function-container">
    <el-card class="card" v-for="(menu,index) in menus" :key="index" :body-style="{padding: '0px'}">
      <div class="image-container" @click="go2(menu.path)">
        <img class="image" :src="menu.img" />
      </div>
      <div style="padding: 14px;" @click="go2(menu.path)">
        <div class="bottom clearfix">
          <span>{{menu.title}}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  computed: {
    menus() {
      let ret = []
      ret.push({
        title: '管理科研项目',
        img: require('~/assets/index_menu/research.jpg'),
        path: '/project'
      })
      ret.push({
        title: '管理科研成果',
        img: require('~/assets/index_menu/achievement.jpg'),
        path: '/achievement'
      })
      ret.push({
        title: '管理科研人员',
        img: require('~/assets/index_menu/researcher.jpg'),
        path: '/researcher'
      })
      ret.push({
        title: '管理研究所',
        img: require('~/assets/index_menu/building.jpg'),
        path: '/laboratory'
      })
      ret.push({
        title: '管理秘书',
        img: require('~/assets/index_menu/woman.jpg'),
        path: '/secretary'
      })
      ret.push({
        title: '管理外部机构',
        img: require('~/assets/index_menu/handshake.jpg'),
        path: '/organization'
      })
      return ret
    }
  },
  methods:{
    go2(path){
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.function-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: center;
  margin-top: 50px;
  .card {
    width: 330px;
    margin: 0 30px;
    margin-bottom: 30px;
    border: none;
    box-shadow: 10px 10px 40px #888888;
    cursor: pointer;
    &:hover {
      transform: scale(1.05, 1.05);
    }
    .image-container {
      width: 330px;
      height: 220px;
      display: flex;
      align-items: center;
      overflow: hidden;
      .image {
        max-width: 330px;
      }
    }
  }
}
</style>

