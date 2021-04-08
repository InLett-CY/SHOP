<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 第一行：搜索区域以及添加用户按钮区域 -->
      <el-row :gutter="20">
        <!-- 搜索部分 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入查询内容"
            v-model="queryInfor.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"
              >查询</el-button
            >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="dialogAddVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="修改信息" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="handleSetRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfor.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogAddVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="70px"
        :model="addUser"
        :rules="addUserRules"
        ref="addUserRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="addUser.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="addUser.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            placeholder="请输入手机号"
            v-model="addUser.mobile"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息 -->
    <el-dialog
      title="修改信息"
      :visible.sync="dialogEditVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        label-width="70px"
        :model="editUser"
        :rules="editUserRules"
        ref="editUserRef"
      >
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="editUser.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="请输入邮箱"
            v-model="editUser.email"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            placeholder="请输入手机号"
            v-model="editUser.mobile"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUser">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible" @close="roleDialogClosed">
      <div>
        <p>用户名：{{ selectUser.username }}</p>
        <p>当前角色：{{ selectUser.role_name }}</p>
        <p>
          更换角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserRole">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 如果邮箱合法
        return cb();
      }
      cb(new Error("请输入合法的邮箱！"));
    };

    var checkMobile = (rule, value, cb) => {
      const regMobile = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号！"));
    };

    return {
      userList: [],
      queryInfor: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      total: 0,
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogRoleVisible: false,
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUser: {
        username: "",
        email: "",
        mobile: "",
      },
      // 添加用户的表单验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名的长度在2-10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码的长度在6-16个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editUserRules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 当前选中的分配角色的对象
      selectUser:{},
      // 所有角色列表
      roleList:[],
      // 选中的角色的ID值
      selectedRoleId:''
    };
  },
  created() {
    // 获取用户信息
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfor,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    async userStateChanged(currentUser) {
      // console.log(currentUser);
      const { data: res } = await this.$http.put(
        `users/${currentUser.id}/state/${currentUser.mg_state}`
      );
      if (res.meta.status !== 200) {
        currentUser.mg_state = !currentUser.mg_state;
        return this.$message.error("切换用户状态失败！");
      }
      this.$message.success("切换用户状态成功！");
    },
    handleSizeChange(newSize) {
      this.queryInfor.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfor.pagenum = newPage;
      this.getUserList();
    },
    addDialogClosed() {
      this.$refs.addUserRef.resetFields();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败！");
      }
      this.editUser = res.data;
      this.dialogEditVisible = true;
    },
    editDialogClosed() {
      this.$refs.editUserRef.resetFields();
    },
    handleAddUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (valid == false) {
          return;
        }
        const { data: res } = await this.$http.post("users", this.addUser);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.dialogAddVisible = false;
        this.getUserList();
      });
    },
    handleEditUser() {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写完整用户信息！");
        }
        const { data: res } = await this.$http.put(
          "users/" + this.editUser.id,
          this.editUser
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败！");
        }
        this.$message.success("修改用户信息成功！");
        this.dialogEditVisible = false;
        this.getUserList();
      });
    },
    async removeUserById(id) {
      // 只要是耗时操作就必须要考虑是否进行异步操作等待的问题
      const confirmResult = await this.$messageBox
        .confirm("删除该用户后不可恢复，是否确定删除？", "删除提示", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除！");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      this.$message.success("删除用户成功！");
      this.getUserList();
    },
    // 分配角色对话框开启的事件
    async handleSetRole(user){
      this.selectUser=user;
      const { data:res } =await this.$http.get("roles");
      if(res.meta.status!==200){
        return this.$message.error("获取角色列表失败！");
      }
      this.roleList=res.data;
      this.dialogRoleVisible=true;
    },
    roleDialogClosed(){
      this.selectUser={};
      this.selectedRoleId='';
    },
    async updateUserRole(){
      if(!this.selectedRoleId){
        return this.$message.error("请选择要分配的角色！");
      }
      const {data:res} =await this.$http.put(`users/${this.selectUser.id}/role`,{rid:this.selectedRoleId});
      if(res.meta.status!==200){
        return this.$message.error("更新角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getUserList();
      this.dialogRoleVisible=false;
    }
  },
};
</script>

<style lang="less" scoped>
.el-card,
.el-pagination,
.el-table {
  margin-top: 10px;
}
</style>