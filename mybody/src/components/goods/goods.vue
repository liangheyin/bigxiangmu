<template>
  <el-card>
    <mybread one="用户管理" two="用户列表"></mybread>
    <!-- 输入框 -->
    <el-row class="myinput">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="myseach"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" @click.prevent="$router.push('/goodsAdd')" plain>新增商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodsData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
     @current-change="curChange"
    @size-change="sizeChange"
      :current-page="pagenum"
      :page-sizes="pagesizes "
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
import mybread from "../layout/mybread";
export default {
  data() {
    return {
      // 数据源
      goodsData: [],
      pagenum: 1,
      pagesize: 10,
      pagesizes: [10, 20, 30],
      total: 0,
      query: ""
    };
  },
  components: {
    mybread: mybread
  },
  methods: {
    getGoodsList() {
      this.$http({
        method: "GET",
        url: `goods?query=${this.query}&pagesize=${this.pagesize}&pagenum=${
          this.pagenum
        }`
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.goodsData = data.goods;
          this.total = data.total;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    sizeChange(pagesize){
    this.pagesize = pagesize
      this.getGoodsList()
    },
    curChange(pagenum){
      this.pagenum = pagenum
      this.getGoodsList()
    },
    myseach(){
      this.getGoodsList()
    },
   
  },
  mounted() {
    this.getGoodsList();
  }
};
</script>

<style>
.myinput {
  margin-top: 20px;
}
</style>
