<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="dialogAddVisible = true"
          >添加角色</el-button
        >
      </el-row>
      <el-table :data="roleList" border stripe height="700px">
        <el-table-column type="index"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row
                  :class="['bdbottom', i2 === 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setDialogVisible(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="30%"
      @close="rightDialogClose"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        ref="treeRef"
        :default-checked-keys="defKeys"
        :props="treeProps"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogAddVisible"
      @close="handleAddRoleColse"
      width="30%"
    >
      <el-form :model="addRole" :rules="addRoleRules" ref="addRoleRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="addRole.roleName"
            autocomplete="off"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="addRole.roleDesc"
            autocomplete="off"
            placeholder="请输入角色描述"
            type="textarea"
            rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="dialogEidtVisible"
      @close="handleEidtRoleColse"
      width="30%"
    >
      <el-form :model="addRole" :rules="addRoleRules" ref="editRoleRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="addRole.roleName"
            autocomplete="off"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="addRole.roleDesc"
            autocomplete="off"
            placeholder="请输入角色描述"
            type="textarea"
            rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEidtVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEidtRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightsList: [],
      rightDialogVisible: false,
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleId: "",
      dialogAddVisible: false,
      dialogEidtVisible: false,
      addRole: {
        roleName: "",
        roleDesc: "",
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色名称的长度在2-10个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.roleList = res.data;
    },
    // 根据id移除对应的权限
    async removeRightById(role, rightid) {
      const confirmResult = await this.$messageBox
        .confirm("此操作会移除该角色所有用户的该权限，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作！");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("移除权限失败！");
      }
      this.$message.success("已成功移除权限！");
      role.children = res.data;
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      this.rightDialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.rightsList = res.data;
      this.getDefkeys(role, this.defKeys);
    },
    getDefkeys(node, arr) {
      // 判断节点包含不包含children属性，
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getDefkeys(item, arr));
    },
    rightDialogClose() {
      this.defKeys = [];
    },
    async handleAddRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      this.getRoleList();
      this.rightDialogVisible = false;
    },
    handleAddRoleColse() {
      this.$refs.addRoleRef.resetFields();
    },
    // 添加新角色
    handleAddRole() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("roles", this.addRole);
        if (res.meta.status != 200) {
          this.$message.error("添加角色失败！");
        }
        this.$message.success("添加角色成功！");
        this.getRoleList();
        this.dialogAddVisible = false;
      });
    },
    // 删除角色
    async handleDeleteRole(id) {
      const confirmResult = await this.$messageBox
        .confirm("删除角色之后不可恢复，是否确定删除？", "删除提示！", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除！");
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status != 200) {
        return this.$$message.error("删除角色失败！");
      }
      this.$message.success("已删除角色！");
      this.getRoleList();
    },
    // 编辑角色
    handleEidtRoleColse() {
      this.addRole = { roleName: "", roleDesc: "" };
      this.roleId = "";
      this.$refs.editRoleRef.resetFields();
    },
    async setDialogVisible(roleid) {
      this.roleId = roleid;
      const { data: res } = await this.$http.get(`roles/${roleid}`);
      if (res.meta.status != 200) {
        return this.$message.error("获取角色信息失败！");
      }
      this.addRole = res.data;
      this.dialogEidtVisible = true;
    },
    async handleEidtRole() {
      this.$refs.editRoleRef.validate(async (vaild) => {
        if (!vaild) {
          return;
        }
        const { data: res } = await this.$http.put(`roles/${this.roleId}`, {
          roleName: this.addRole.roleName,
          roleDesc: this.addRole.roleDesc,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色信息失败！");
        }
        this.$message.success("修改角色信息成功！");
        this.dialogEidtVisible = false;
        this.getRoleList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-card {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
</style>