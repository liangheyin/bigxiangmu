// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入myaxios
import myaxios from '../src/assets/js/myaxios'
  
import ElTreeGrid from 'element-tree-grid' 
import '@/assets/css/index.css'

Vue.use(Element)

Vue.use(myaxios)

Vue.component(ElTreeGrid.name,ElTreeGrid)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
