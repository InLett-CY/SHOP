<template>
  <!-- 首先对后台管理系统主页进行布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logos.png" />
        <span>酱品购后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c75"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template #title>
              <i v-bind:class="iconsObj[item.id + '']"></i>&nbsp;&nbsp;&nbsp;
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.id + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template>
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: null,
      iconsObj: {
        125: "iconfont icon-user-group-Fill",
        103: "iconfont icon-distribution-Fill",
        101: "iconfont icon-buy-Fill",
        102: "iconfont icon-calendar-Fill",
        145: "iconfont icon-trendchart-Fill",
      },
      isCollapse: false,
    };
  },
  created() {
    this.getMeuList();
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMeuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
    },
    toggleCollapse(){
        this.isCollapse=!this.isCollapse;
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #473f3f;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
  color: #fff;
  font-size: 40px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #545c75;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: rgb(223, 219, 219);
}
.toggle-button{
  background-color: #545c75;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  width: 100%;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>