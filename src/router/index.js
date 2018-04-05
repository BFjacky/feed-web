import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import postThread from '@/components/post/postThread'
import commentPage from '@/components/home/commentPage'
import sonCommentPage from '@/components/home/sonCommentPage'
import shieldPage from "@/components/person/shieldPage"
import focusPage from "@/components/person/focusPage"
import fansPage from "@/components/person/fansPage"
import mine from '@/components/person/mine'
import notify from '@/components/person/notify'
import store from "@/components/helper/store"
import postBar from "@/components/home/components/postBar";
import myPopup from "@/components/myPopup";
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/index/postThread',
      name: 'postThread',
      component: postThread,
    },
    {
      path: '/index/commentPage',
      name: 'commentPage',
      component: commentPage,
    },
    {
      path: '/index/commentPage/sonCommentPage',
      name: 'sonCommentPage',
      component: sonCommentPage,
    },
    {
      path: '/index/mine',
      name: 'mine',
      component: mine,
    },
    {
      path: '/index/person/deep/notify',
      name: 'notify',
      component: notify,
    },
    {
      path: '/index/shieldPage',
      name: 'shieldPage',
      component: shieldPage,
    },
    {
      path: '/index/focusPage',
      name: 'focusPage',
      component: focusPage,
    },
    {
      path: '/index/fansPage',
      name: 'fansPage',
      component: fansPage,
    }
  ]
})
//编辑页面的lock，禁止随意退出

router.beforeEach(async (to, from, next) => {
  if (from.name === 'postThread' && !to.params.allowBack && !store.postThread.hasSent) {
    const res = await postThread.methods.showBackModal();
    if (res === 'ok') {
      next();
      return;
    }
    next(false)
    return;
  }
  store.postThread.hasSent = false;
  next()
})
export default router;