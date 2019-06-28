
import axios from 'axios'

var myaxios = {}
myaxios.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    if (!config.url.includes('login')) {

      config.headers.Authorization = window.localStorage.getItem('token')
    }
    return config;
  })

  Vue.prototype.$http = axios
}

// 暴露出去
export default myaxios