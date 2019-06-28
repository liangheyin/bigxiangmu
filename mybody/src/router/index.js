import Vue from 'vue'
import Router from 'vue-router'
// 引入message
import { Message } from 'element-ui'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import UseElement from '@/components/useElement/useElement.vue'
import Users from '../components/users/users.vue'
import Rights from '../components/rights/rights.vue'
import Roles from '../components/roles/roles.vue'
import Categories from '../components/categories/categories.vue'
import Goods from '../components/goods/goods.vue'
import GoodsAdd from '../components/goodsAdd/goodsAdd.vue'
Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', redirect: '/home' }, // 主页路由
    { path: '/login', name: 'login', component: Login }, // 登录
    { path: '/useElement', name: 'useElement', component: UseElement },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: '/users', component: Users },// 主页下的子路由
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories},
        { path: '/goods', component: Goods},
        { path: '/goodsAdd', component: GoodsAdd},
      ]
    },

  ]
})
router.beforeEach(function (to, from, next) {
  // to : 要去的路由对应的对象
  // from：离开的路由对应的对象
  // next： 后续代码
  if (to.name !== "login") {
    let token = window.localStorage.getItem('token')
    if (!token) {
      // 跳转到Login路由
      Message.error('请先登录')
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }



})

export default router