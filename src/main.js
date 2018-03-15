// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import lodash from './lodash'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(lodash)
Vue.use(infiniteScroll)
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import 'mint-ui/lib/style.css'
// Vue.use(ElementUI)
Vue.config.productionTip = false
// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
