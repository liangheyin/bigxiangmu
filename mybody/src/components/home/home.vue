<template>
  <el-container>
    <el-header>
      <TopBar></TopBar>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <SideBar></SideBar>
      <!-- 内容 -->
      <el-main>

        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TopBar from '../layout/topBar'
import SideBar from '../layout/sideBar'

export default {
  components: {
    TopBar: TopBar,
    SideBar: SideBar
  },

  mounted () {
    // let token = window.localStorage.getItem('token')

    // if (!token) {
    //   this.$message.error('请先登录')

    //   this.$router.push({ name: 'login' })
    // }
  }
}
</script>

<style >
h1 {
  line-height: 60px;
  margin: 0;
  padding: 0;
  color: #fff;
}
.mylink {
  text-decoration: none;
  color: pink;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
