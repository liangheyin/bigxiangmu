<template>
  <el-card>
    <mybread one="商品管理" two="商品分类"></mybread>
    <el-button @click="dialogFormFn" class="mybtn" type="success" plain size="medium">添加分类</el-button>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="pageList" style="width: 100%">
      <!-- 树形结构 -->

      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        prop="cat_name"
        label="分类名称"
        width="180"
      ></el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.cat_level===0?'一级':scope.row.cat_level===1?'二级':"三级"}}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">{{scope.row.cat_deleted?"有效":'无效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope=" scope ">
          {{scope.row.id}}
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="curChange"
      :page-size="pagesize"
      :page-sizes="pagesizes"
      :current-page="pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialog">
      <el-form>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="cateName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <!-- 级联框 -->
          <el-cascader clearable v-model="selValue" :options="selList" :props="propsObj"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateFn">确 定</el-button>
        <!--  -->
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mybread from "../layout/mybread";
export default {
  data() {
    return {
      loading: true,
      categoriesList: [],
      pagesize: 5,
      pagenum: 1,
      // 分页的数据源
      pageList: [],
      total: 0,
      pagesizes: [5, 10, 15],
      addDialog: false,
      formLabelWidth: "80px",
      // 级联框绑定的数据
      selValue: [],
      // 级联框的数据源
      selList: [],
      propsObj: {
        checkStrictly : true,//是否可以选择一项
        expandTrigger: "hover", //触发的方式
        label: "cat_name", //选中的文本
        value: "cat_id" //对应的值
      },
      cateName: ""
    };
  },

  components: {
    mybread: mybread
  },
  methods: {
    getCategoriesList() {
      //得到所有的分类数据
      this.$http({
        method: "GET",
        url: "categories"
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          // 将数据进行保存
          this.categoriesList = data;
          // 设置数据总长度
          this.total = this.categoriesList.length;

          // 给分页数据赋值
          this.getPageList();

          setTimeout(() => {
            this.loading = false;
          }, 1000);
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    getPageList() {
      // 开始的下标
      let begin = this.pagesize * (this.pagenum - 1);
      // 结束的下标
      let end = this.pagesize * this.pagenum;
      this.pageList = this.categoriesList.slice(begin, end);
    },
    // 当前页发生了改变
    curChange(currentPage) {
      this.pagenum = currentPage;
      this.getPageList();
    },
    sizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getPageList();
    },
    dialogFormFn() {
      this.addDialog = true;
    },
    // 得到二级分类数据
    getTwoData() {
      this.$http({
        method: "GET",
        url: `categories?type=2`
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.selList = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    addCateFn() {
      let pid =
        this.selValue.length === 0
          ? 0
          : this.selValue[this.selValue.length - 1];
      let level = this.selValue.length;
      this.$http({
        method: "POST",
        url: "categories",
        data: {
          cat_pid: pid,
          cat_name: this.cateName,
          cat_level: level
        }
      }).then(res => {
        let { meta } = res.data;
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
          this.addDialog = false;
          this.getCategoriesList();
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
    this.getCategoriesList();
    this.getTwoData();
  }
};
</script>

<style scoped>
.mybtn {
  margin-top: 20px;
}
</style>
