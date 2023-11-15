import { createRouter, createWebHashHistory } from 'vue-router'
import axios from "axios";
import { useRoomStore } from '../stores/roomInformation'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/WelcomeView.vue'),
      children: [
        {
          path: '',
          name: 'welcome-login',
          component: () => import('@/components/Welcome/LoginPage.vue')
        },
        {
          path: 'register',
          name: 'welcome-register',
          component: () => import('@/components/Welcome/RegisterPage.vue')
        },

      ]
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: () => import('@/views/HomePageView.vue')
    },
    // {
    //   path: '/index',
    //   name: 'index',
    //   component: () => import('@/views/IndexView.vue')
    // },
    {
      path: '/game',
      name: 'game',
      // component: () => import("@/views/ShudanView.vue")
      component: () => import("@/views/GameView.vue")
    },
  ]
})

/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach((to, from, next) => {
  // 获取 token
  const token = localStorage.getItem('Authorization');
  const token2 = axios.defaults.headers.common['Authorization']

  let isLogin = !((token === null || token === '' || token === undefined) && (token2 === null || token2 === '' || token2 === undefined)) && useRoomStore().ws_state
  // console.log(token)
  // console.log(token2)
  // console.log(isLogin)

  if (to.path === '/' || to.path === '/register') {

    if (isLogin) next('/homepage')
    else next();
  } else {
    // token 不存在
    if (!isLogin) {
      next('/');
    } else {
      next();
    }
  }
});

export default router
