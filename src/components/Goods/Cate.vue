<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDailog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        class="treetable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效标志 -->
        <template slot="isactive" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted === true"
            style="color: red"
          ></i>
        </template>
        <!-- 等级 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level == 2" type="danger">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="openEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-delete"
            @click="handleDeleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfor.pagenum"
        :page-sizes="[4, 7, 10, 13]"
        :page-size="queryInfor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form :model="addCate" :rules="addCateRules" ref="addCateRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="addCate.cat_name"
            placeholder="请输入分类名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            clearable
            :props="cascaderProps"
            @change="parentCateChanged"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改分类信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="closeCateDialog"
    >
      <el-form :model="editCate" :rules="addCateRules" ref="editCateRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="editCate.cat_name"
            placeholder="请输入分类名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfor: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          headerAlign: "center",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isactive",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "等级排列",
          type: "template",
          template: "order",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
          align: "center",
          headerAlign: "center",
        },
      ],
      addDialogVisible: false,
      editDialogVisible: false,
      addCate: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //   父级分类
      parentCateList: [],
      //   选中的父级分类的Id数组
      selectedKeys: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      editCate: {
        cat_name: "",
      },
      selectCateid:0
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfor,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败！");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfor.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfor.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDailog() {
      this.getParentCateList();
      this.addDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败！");
      }
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 首先判断添加的是一级还是二级分类，使用selectedKeys的长度类判断
      if (this.selectedKeys.length > 0) {
        this.addCate.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCate.cat_level = this.selectedKeys.length;
        return;
      }
      this.addCate.cat_pid = 0;
      this.addCate.cat_level = 0;
    },
    handleAddCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("categories", this.addCate);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addDialogVisible = false;
      });
    },
    addDialogClosed() {
      this.$refs.addCateRef.resetFields();
      this.selectedKeys = [];
      this.addCate.cat_pid = 0;
      this.addCate.cat_level = 0;
    },
    async handleDeleteCate(cat_id) {
      const confirmResult = await this.$messageBox
        .confirm("删除商品分类之后不可恢复，是否确定删除？", "删除提示！", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除！");
      }
      const { data: res } = await this.$http.delete(`categories/${cat_id}`);
      if (res.meta.status != 200) {
        return this.$message.error("删除商品分类失败！");
      }
      this.$message.success("已删除商品分类！");
      this.getCateList();
    },
    handleEditCate() {
        this.$refs.editCateRef.validate(async (valid) => {
            if (!valid) {
                return;
            }
            const { data:res }=await this.$http.put(`categories/${this.selectCateid}`,{cat_name:this.editCate.cat_name});
            if(res.meta.status!=200){
                return this.$message.error("修改商品分类信息失败！");
            }
            this.$message.success("修改商品分类信息成功！");
            this.getCateList();
            this.editDialogVisible=false;
        })
    },
    async openEditDialog(cat_id) {
        this.selectCateid=cat_id;
        const { data:res }=await this.$http.get(`categories/${cat_id}`);
        if(res.meta.status!=200){
            return this.$message.error("获取商品分类失败！");
        }
        this.editCate=res.data;
        this.editDialogVisible=true;
    },
    closeCateDialog(){
        this.editCate={cat_name:""}
    }
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
.treetable {
  margin-top: 10px;
  max-height: 680px;
  overflow-y: auto;
}
</style>