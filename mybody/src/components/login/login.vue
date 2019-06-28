<template>
  <div class="login">
    <div class="content">
      <el-form
        :model="userObj"
        status-icon
        :rules="rules"
        label-position="top"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <h2>用户登录</h2>
        <!-- el-form-item ： label ： 文本 -->
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="userObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userObj.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="mybtn" @click.prevent="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userObj: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入正确的密码', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    login () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http({
            method: 'POST',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.userObj
          }).then(res => {
            // 解构
            let {data, meta} = res.data
            if (meta.status === 200) {
              
              // 保存token
              window.localStorage.setItem('token', data.token)
              //  正确跳转主页
              this.$router.push('/')
              this.$message({
                type: 'success',
                message: meta.msg
              })
            } else {
              this.$message.error(meta.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style  scoped>
.login {
  width: 100%;
  height: 100%;
  background: #324152;
  position: relative;
}

.content {
  width: 580px;
  height: 440px;
  padding: 40px;
  box-sizing: border-box;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}

.mybtn {
  width: 100%;
}
</style>
