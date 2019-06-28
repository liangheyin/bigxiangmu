<template>
  <el-card>
    <!-- 面包屑 -->
  <mybread one="权限管理" two="权限列表"></mybread>
    <!-- 表格 -->
    <el-table class="your" :data="tableData" style="width: 100%">
      <el-table-column type="index" ></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column  label="层级">

        <template slot-scope="scope">
          {{scope.row.level === '0'?'一级':scope.row.level ==="1"?"二级":"三级"}}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>

import mybread from '../layout/mybread'
export default {
  data(){
    return {
      tableData:[]
    }
  },
  components :{
    mybread:mybread
  },
  methods:{
    getRihtList(){
      this.$http({
        method : 'GET',
        url : 'rights/list',
        
      }).then(res =>{
        let {data,meta} = res.data 
        if(meta.status === 200){
          this.tableData = data
        }else {
            this.$message.console.error(meta.msg);
             
        }
      })
    }
  },
  mounted() {
    this.getRihtList() 
  },
};
</script>

<style>
.your {
  margin-top: 20px;
}
</style>
