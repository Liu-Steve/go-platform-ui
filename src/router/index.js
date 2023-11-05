import { createRouter, createWebHashHistory } from 'vue-router'
import axios from "axios";

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
      path: '/index',
      name: 'index',
      component: () => import('@/views/IndexView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import("@/views/ShudanView.vue")
    },
  ]
})

/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/register') {
    // 登录或者注册才可以往下进行
    next();
  } else {
    // 获取 token
    const token = localStorage.getItem('Authorization');
    const token2 = axios.defaults.headers.common['Authorization']
    // token 不存在
    if ((token === null || token === '') && (token2 === null || token2 === '')) {
      ElMessage.error('您还没有登录，请先登录');
      next('/');
    } else {
      next();
    }
  }
});

export default router
