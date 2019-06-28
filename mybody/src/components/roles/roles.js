

import mybread from '../layout/mybread.vue'
export default {
  data(){
    return {
      tableData:[],
      roleDialog:false,
      rightsList :[],
      
      defaultProps :{
        label:'authName',
        children:'children'
      },
      defaultChecked:[],
      // 设置权限的角色ID
      setRoleId :0
    }
  },
  methods: {
    getRolesList(){
      this.$http({
        method :'GET',
        url :'roles'
      }).then(res =>{
        let {meta,data} =res.data
        if(meta.status ===200){
          this.tableData =data
        }else{
          this.$message.error(meta.msg)
        }
      })
    },
    delRight(roleId,rightId,scope){
      this.$http({
        method :'DELETE',
        url :`roles/${roleId}/rights/${rightId}`,
        
      }).then(res => {
        let {data, meta} =res.data
        if(meta.status === 200){
          this.$message({
            message :meta.msg,
            type :'success'
           
          })
          scope.row.children = data
        }else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 打开分配
    openRole(rightsData,id){
      // 将当前角色的id保存起来
      this.setRoleId =  id 

      this.defaultChecked=[]
      this.$http({
        method:'GET',
        url:'rights/tree',

      }).then(res=>{
        let {meta,data}=res.data
        if (meta.status === 200){
          this.rightsList = data
          this.roleDialog = true
          // 将所有三级权限的id保存
          rightsData.forEach(item1 =>{
            item1.children.forEach(item2=>{
              item2.children.forEach(item3=>{
                this.defaultChecked.push(item3.id)
              })
            })
          })
        }else {
          this.$message.error(meta.msg)
        }
      }) 
    },
    // 设置权限
    setRigrtFn(){

      // 获取更新后权限
      // 获取全选
      let idsAll = this.$refs.mytree.getCheckedKeys()
      // 获取半选
      let idsHarf = this.$refs.mytree.getHalfCheckedKeys()
      // 将全选与半选组合
      // 展开运算符
      let ids = [...idsAll, ...idsHarf]
      
      ids= ids.join(',')
      this.$http({
        method : 'POST',
        url :`roles/${this.setRoleId}/rights`,
        data :{
          rids : ids
        }
      }).then(res =>{
        let {meta} = res.data
        if(meta.status === 200){
          this.$message({
            message :meta.msg,
            type :'success'
          })
          // 重新获取数据
          this.getRolesList()
        }else {
          this.$message.error(meta.msg)
        }
      })

      this.roleDialog = false
    }
  },  
  components : {
    mybread:mybread
  },
  mounted() {
    this.getRolesList()
  },
}