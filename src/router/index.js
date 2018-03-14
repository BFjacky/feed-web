import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import postThread from '@/components/post/postThread'
Vue.use(Router)

const router = new Router({
  mode:'history',
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
router.beforeEach(async (to, from, next) => {
  const oldFrom = from;
  const oldTo = to;
  console.log('from:', from);
  console.log('to', to)
  if (from.name === 'postThread') {
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