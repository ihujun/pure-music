import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import Fastclick from 'fastclick'
Fastclick.attach(document.body)

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import '@/base/font/iconfont.css'

//mint-ui图片懒加载
Vue.use(MintUI,{
  lazyload:{
    loading: require('base/img/loading.gif')
  }
})

Vue.config.productionTip = false


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
})
