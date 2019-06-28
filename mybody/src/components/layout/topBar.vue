<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../../assets/imgs/logo.png" alt>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <h1>电商后台管理</h1>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <a class="mylink" @click.prevent="tuichu" href="#">退出</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    tuichu () {
      this.$confirm('确定退出？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          // 退出时 删除token
          window.localStorage.removeItem('token')
          //  跳转到登录页面
          this.$router.push({
            name: 'login'
          })
          this.$message({
            type: 'success',
            message: '退出成功！'
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
</style>
