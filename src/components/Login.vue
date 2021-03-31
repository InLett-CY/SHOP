<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <el-form :rules="loginUserRules" :model="loginUser" ref="LoginFormRef" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginUser.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginUser.password" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetlogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 数据绑定
            loginUser:{
                username:"",
                password:""
            },
            // 表单验证规则
            loginUserRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度在3到10个字符', trigger: 'blur'  }
                ],
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码长度在6到15个字符', trigger: 'blur'  }
                ]
            }
        }
    },

    // 注册事件
    methods:{
        login(){
            // 当按下登录按钮的时候先判断验证
            // console.log(this.$refs.LoginFormRef);
            this.$refs.LoginFormRef.validate(async vaild=>{
                if(!vaild){
                    return;
                }
                const { data:res }=await this.$http.post("login",this.loginUser);
                if(res.meta.status!==200){
                    return this.$message.error("登录失败："+res.meta.msg)
                }

                this.$message.success("登录成功！");
                // 登录成功之后保存token
                window.sessionStorage.setItem("token",res.data.token);
                // 导航到Home页面
                this.$router.push('/home');
            });
        },
        resetlogin(){
            this.$refs.LoginFormRef.resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
.login_form{
    padding: 0 20px;
    position: absolute;
    bottom:0px;
    width: 100%;
    box-sizing: border-box;
    .btns{
        display: flex;
        justify-content: flex-end;
    }
}
</style>