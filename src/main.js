// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import lodash from './lodash'
import config from "./components/helper/config";
import events from "./components/helper/events";

import { InfiniteScroll } from 'mint-ui';
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, `${config.url.socketUrl}`);
Vue.use(lodash)
Vue.use(InfiniteScroll)
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
  template: '<App/>',
  sockets: {
    disconnect: function () {
      console.log(`断开连接`)
      // this.$socket.io.readyState = 'closed'
      // this.$socket.io.reconnect()
    },
    reconnecting: function () {
      console.log('正在重连')
    },
    error: function () {
      console.log(`出现错误`)
    },
    connect: function () {
      console.log('连接成功')
      events.$emit('socketConnected')
    },
    res: function (val) {
    },
    // praiseThread: function (val) {

    // }
  }
})
