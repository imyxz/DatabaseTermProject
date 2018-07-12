<template>
<el-container>
  <div class="total-background">
    <div class="background-cover"></div>
    <div class="background-image"></div>
  </div>
  <!--<el-header style="padding: 0;">
    <common-header></common-header>
  </el-header>-->
  <el-main class="main-container">
    <nuxt />
  </el-main>
</el-container>
</template>
<script>
import CommonHeader from '~/components/CommonHeader'
export default {
  components:{
    CommonHeader
  }
}
</script>
<style lang="scss">
body{
  margin: 0;
}
.total-background{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  .background-image {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('~/assets/galaxy.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
  .background-cover{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.4;
    background-color: black;
  }
}
.main-container{
  opacity: 0.9;
}
.panel{
  background-color: white;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}
.border{
  border-style: solid;
  border-width: 1px;
  border-color: #66CCFF;
  padding: 10px;
}
</style>
