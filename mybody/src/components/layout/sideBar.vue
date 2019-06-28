<template>
  <el-menu
    :router="true"
    :unique-opened="true"
    default-active="2"
    class="mymenu el-menu-vertical-demo"
  >
    <el-submenu v-for="item in rightsList" :key="item.id" :index="item.path">
      <template slot="title">
        <!-- 图标 -->
        <i class="el-icon-location"></i>
        <!-- 文本 -->
        <span>{{item.authName}}</span>
      </template>
      <el-menu-item v-for="son in item.children" :key="son.id" :index="son.path">
        <i class="el-icon-menu"></i>
        <span>{{son.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },

  methods: {
    getRightsList() {
      this.$http({
        url: "menus"
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.rightsList = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
    this.getRightsList();
  }
};
</script>

<style>
.mymenu {
  width: 200px;
}
</style>
