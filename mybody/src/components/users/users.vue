<template>
  <el-card>
    <!-- 面包屑导航 -->
    <mybread one="用户管理" two="用户列表"></mybread>
    <!-- 输入框 -->
    <el-row class="myinput">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="myseach"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" @click.prevent="addUserse" plain>新增用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="130"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- slot-scope = "scope"  当前行的数据源 -->
        <template slot-scope="scope">
          {{scope.row}}
          <el-switch
            @change="selChange(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          {{scope.row.id}}
          <el-button
            type="primary"
            @click="editData(scope.row.id)"
            icon="el-icon-edit"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            @click="del(scope.row.id)"
            icon="el-icon-delete"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="success"
            @click="roleData(scope.row.id)"
            icon="el-icon-check"
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <el-pagination
      @current-change="currentChange"
      @size-change="sizeChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 新增对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddialog">
      <el-form :model="addUser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUser.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="addUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="addUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormC">取 消</el-button>
        <el-button type="primary" @click="dialogFormA">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdialog">
      <el-form :model="editDatas">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="editDatas.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editDatas.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editDatas.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormC">取 消</el-button>
        <el-button type="primary" @click="editDialogFn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roledialog">
      <el-form :model="roledatas">
        {{roledatas}}
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="roledatas.username" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 下拉框  -->
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="roledatas.rid" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="item in selDataList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormC">取 消</el-button>
        <el-button type="primary" @click="roleDialogFn">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import mybread from '../layout/mybread'
export default {
  data() {
    return {
      tableData: [],
      query: "",
      // 当前页
      pagenum: 1,
      // 也容量
      pagesize: 5,
      pagesizes: [3, 5, 10, 15],
      total: 0,
      // 控制新增对话框的显示和隐藏
      adddialog: false,
      // 控制修改对话框的显示和隐藏
      editdialog: false,
      // 控制分配角色对话框的显示和隐藏
      roledialog: false,
      // 文本宽度
      formLabelWidth: "80px",
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editDatas: {
        id: "",
        username: "",
        mobile: "",
        email: ""
      },
      // 分配角色的数据
      roledatas: {
        username: "",
        id: "",
        rid: ""
      },
      selDataList: []
    };
  },
  methods: {
    getTableData() {
      this.$http({
        method: "GET",
        url: `users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        // 解构
        let { meta, data } = res.data;
        if (meta.status === 200) {
          if (data.users.length === 0 && this.pagenum != 1) {
            this.getTableData();
            this.pagenum--;
            return;
          }
          this.tableData = data.users;
          // rotal : 是数据总条数
          this.total = data.total;
        }
      });
    },
    // 当 当前页 改变的时候改变
    currentChange(currentPage) {
      this.pagenum = currentPage;
      this.getTableData();
    },
    //  当页容量改变的时候改变
    sizeChange(sizePage) {
      this.pagesize = sizePage;
      this.getTableData();
    },
    myseach() {
      this.getTableData();
    },
    // 新增用户的点击事件
    addUserse() {
      this.adddialog = true;
    },
    // 关闭对话框
    dialogFormC() {
      this.adddialog = false;
    },
    // 新增方法
    dialogFormA() {
      this.$http({
        method: "POST",
        url: "users",
        data: this.addUser,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(res.data.meta.msg);
        }

        this.addUser.username = "";
        this.addUser.password = "";
        this.addUser.email = "";
        this.addUser.mobile = "";
        this.adddialog = false;
        this.getTableData();
      });
    },
    // 删除方法
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          method: "DELETE",
          url: `users/${id}`,
          headers: {
            Authorization: window.localStorage.getItem("token")
          }
        }).then(res => {
          let { meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: "success"
            });
            this.getTableData();
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
      });
    },
    editData(id) {
      this.$http({
        method: "GET",
        url: `users/${id}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          // 将数据存起来
          this.editDatas.id = data.id;
          this.editDatas.email = data.email;
          this.editDatas.username = data.username;
          this.editDatas.mobile = data.mobile;
          // 修改对话框的显示
          this.editdialog = true;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    editDialogFn() {
      this.$http({
        method: "PUT",
        url: `users/${this.editDatas.id}`,
        data: {
          mobile: this.editDatas.mobile,
          email: this.editDatas.email
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.getTableData();
        } else {
          this.$message.error(meta.msg);
        }
        this.editdialog = false;
      });
    },
    roleData(id) {
      this.$http({
        method: "GET",
        url: `users/${id}`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          // 将数据存起来
          this.roledatas.id = data.id;
          this.roledatas.username = data.username;
          this.roledatas.rid = data.rid;
          // 获取下拉框中的数据

          this.$http({
            method: "GET",
            url: `roles`,
            headers: {
              Authorization: window.localStorage.getItem("token")
            }
          }).then(res => {
            let { data, meta } = res.data;
            // 判读
            if (meta.status === 200) {
              // 下拉框的数据赋值
              this.selDataList = data;
            }
          });
          // 修改对话框的显示
          this.roledialog = true;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    roleDialogFn() {
      this.$http({
        method: "PUT",
        url: `users/${
          this.roledatas.id
        }/role`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
        data: {
          rid: this.roledatas.rid
        }
      }).then(res => {
        let { meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(meta.msg);
        }
        this.roledialog = false;
      });
    },
    selChange(uid,type) {
      this.$http({
        method: "PUT",
        url: `users/${uid}/state/${type}`,
         headers: {
          Authorization: window.localStorage.getItem("token")
        },
      }).then(res =>{
        let {meta} =res.data
        if(meta.status === 200){
          this.$message({
            message:meta.msg,
            type: "success"
          })
        }else{
          this.$message.error(meta.msg)
        }
      })
    }
  },

  // 打开页面渲染数据
  mounted() {
    this.getTableData();
  },
  components :{
    mybread:mybread
  }
};
</script>

<style>
.myinput {
  margin-top: 20px;
}
</style>
