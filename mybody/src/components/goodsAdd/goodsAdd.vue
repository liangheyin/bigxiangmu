<template>
  <el-card>
    <mybread one="商品管理" two="商品列表"></mybread>
    <!-- 提示框 -->
    <el-alert class="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <!--  v-model:一般配合 el-tab-pane中的  name 使用-->
    <el-tabs v-model="activeName" @tab-click="tabClick" tabPosition="left">
      <el-tab-pane label="基本信息" name="first">
        <!-- 表单 -->
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item label="商品名称" prop="name">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="name">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="name">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="name">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="name">
            <!-- options : 绑定数据源 -->
            {{cateValue}}
            <el-cascader
              :clearable="true"
              v-model="cateValue"
              :options="cateList"
              :props="propsObj"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div v-for="(item,index ) in goodsMany " :key="index">
          <div class="mybos">{{item.attr_name}}</div>
          <div>
            <el-checkbox
              v-for="(val,inde) in item.attr_vals.split(',')"
              :key="inde"
              border
              v-model="checked"
            >{{val}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <!-- 渲染商品属性 -->
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item
            v-for="(item,index) in goodsOnly"
            :key="index"
            :label="item.attr_name"
            prop="name"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- 上传图片 -->
        <!-- action 存储的路径 -->
        <!-- on-preview ： 钩子函数 -->
        <!-- :on-success ： 文件上传成功时的钩子函数 -->
        <!-- on-remove ： 文件删除的钩子函数 -->
        <!--  list-type  ： 上传元素的显示方式， 以图片的方式显示 -->
        <el-upload
          :on-preview="myPreview"
          :on-remove="uploadRem"
          :on-success="uploadSuccess"
          class="upload-demo"
          :headers="headersData"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fixth">商品内容</el-tab-pane>
    </el-tabs>
    <!-- 预览图片的对话的 -->
    <el-dialog title="预览图片" :visible.sync="imgDialog">
      <div slot="footer" class="dialog-footer">
        <img ref="myimg" src>
        <el-button type="primary" @click="imgDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mybread from "../layout/mybread";
export default {
  data() {
    return {
      active: 0,
      activeName: "first",
      // 数据源  cateList
      cateList: [],
      propsObj: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id"
      },
      // 级联框中的数据
      cateValue: [],
      // 商品参数
      goodsMany: [],
      // 商品属性
      goodsOnly: [],
      // 默认值为选择
      checked: true,
      // 请求头
      headersData: {
        Authorization: window.localStorage.getItem("token")
      },
      // 上传 的图片集合
      fileList: [],
      imgDialog: false
    };
  },
  components: {
    mybread: mybread
  },
  methods: {
    tabClick(tag) {
      // 让步骤条与tab相同
      this.active = +tag.index;
      // 商品参数
      if (tag.index === "1") {
        this.getEachList("many");
      }
      // 商品属性
      if (tag.index === "2") {
        this.getEachList("only");
      }
    },
    // 封装的函数
    getEachList(sel) {
      //
      if (this.cateValue.length !== 0) {
        this.$http({
          url: `categories/${
            this.cateValue[this.cateValue.length - 1]
          }/attributes?sel=${sel}`
        }).then(res => {
          let { meta, data } = res.data;
          if (meta.status === 200) {
            if (sel === "many") {
              this.goodsMany = data;
            } else {
              this.goodsOnly = data;
            }
          } else {
            this.$message.error(meta.msg);
          }
        });
      } else {
        this.$message.error("请选择商品分类");
      }
    },

    // 获取数据源的函数
    getCateList() {
      this.$http({
        url: "categories"
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status === 200) {
          this.cateList = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 文件上传成功时执行的函数
    uploadSuccess(response, file, fileList) {
      // response ： 上传成功后响应的内容
      //  file ： 上传成功的文件信息
      //  fileList ：上传成功的文件 集合
      console.log(response.data);
      // 将文件保存在fileList中
      this.fileList.push(response.data.tmp_path);
    },
    // 文件删除执行的函数
    uploadRem(file, fileList) {
      // 将删除的图片从数组中删除
      let img = file.response.data.tmp_path;
      this.fileList.forEach((item, index) => {
        if (item === img) {
          this.fileList.splice(index, 1);
        }
      });
    },
    // 预览图片
    myPreview(file) {
      // 得到图片的在线地址
      let img = file.response.data.url
      // 显示对话框
      this.imgDialog = true
      // 调用这个方法可以立即重新渲染界面
      this.$nextTick(() => {
        // 将图片显示
        this.$refs.myimg.src = img;
      });
    }
  },
  mounted() {
    this.getCateList();
  }
};
</script>

<style>
.myalert {
  margin: 15px 0px;
}
.el-step__title.is-success {
  font-size: 12px;
}
.el-step__title.is-process {
  font-size: 12px;
}
.el-step__title.is-wait {
  font-size: 12px;
}
.mybos {
  margin: 15px 0px;
}
label.el-checkbox.is-bordered.is-checked {
  margin-right: 0px;
}
</style>
