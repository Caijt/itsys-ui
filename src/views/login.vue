<template>
  <div class="login-container">
    <el-form 
      autoComplete="on" 
      :model="loginForm"  
      size='default' 
      :rules="loginRules" 
      ref="loginForm" 
      class="card-box login-form">
      <h3 class="title">{{$store.state.sys.title}}</h3>
      <el-form-item prop="username">
        <el-input name="username"   type="text" v-model.trim="loginForm.username" autoComplete="on" placeholder="登录用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password"  :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="登录密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="tips">Copyright © {{ new Date().getFullYear() }} {{$store.state.sys.company}}</div>
    </el-form>    
  </div>
</template>

<script>
  import sysConfigApi from '@/api/sys/config'

export default {
  name: 'login',
  data() {
    return {      
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message:'请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message:'请输入密码' }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  computed:{
  },
  created(){
    // sysConfigApi.getValue('login').then(res=>{
    //   let remoteVersion = res.data
    //   if(remoteVersion !==this.$refs.version.innerText){
    //     this.$confirm('检测本地系统版本与服务器系统版本不一致，是否进行刷新加载更新内容？','更新提示',{
    //       type:'warning',
    //       confirmButtonText: '刷新',
    //     }).then(()=>{
    //       // this.$store.
    //       // window.location.reload()
    //     })
    //   }
    // })
  },
  methods: {
    checkLogin(){
      configApi.getValue('login').then(res=>{
        if(res.data==='off'){
          this.isLogin = false
        }
      })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm).then((res) => {
          	//this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: $light_gray;
      margin-bottom: 10px;
      text-align: center;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      margin-bottom:22px;
    }
    .el-form-item__error{
      padding-top:4px;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
