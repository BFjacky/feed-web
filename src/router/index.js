import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import postThread from '@/components/post/postThread'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/postThread',
      name: '/postThread',
      component: postThread
    }
  ]
})
