import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import postThread from '@/components/post/postThread'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/postThread',
      name: 'postThread',
      component: postThread,
      meta: { allowBack: false },
    }
  ]
})
//编辑页面的lock，禁止随意退出

router.beforeEach(async (to, from, next) => {
  if (from.name === 'postThread' && !to.params.allowBack) {
    const res = await postThread.methods.showBackModal();
    if (res === 'ok') {
      next();
      return;
    }
    next(false)
    return;
  }
  next()
})
export default router;