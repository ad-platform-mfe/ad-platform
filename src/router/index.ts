import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import login from '@/views/main/login.vue';
import childHomeView from '@/views/child/childHome.vue';
import childJob from '@/views/child/childJob.vue';
import childEnterprise from '@/views/child/childEnterprise.vue';
import childAbout from '@/views/child/childAbout.vue';
import HomeView from '@/views/main/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: '登录',
      keepAlive: false,
    },
  },
  {
    path: '/childHomeView',
    name: 'childHomeView',
    component: childHomeView,
    meta: {
      title: '子应用-首页',
      keepAlive: false,
    },
  },
  {
    path: '/childJob',
    name: 'childJob',
    component: childJob,
    meta: {
      title: '子应用-工作',
      keepAlive: false,
    },
  },
  {
    path: '/childEnterprise',
    name: 'childEnterprise',
    component: childEnterprise,
    meta: {
      title: '子应用-企业',
      keepAlive: false,
    },
  },
  {
    path: '/childAbout',
    name: 'childAbout',
    component: childAbout,
    meta: {
      title: '子应用-关于',
      keepAlive: false,
    },
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const whiteList = ['/login']; // 不需要token的白名单

  if (token) {
    if (to.path === '/login') {
      // 如果已登录，还想去登录页，则重定向到首页
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    // 如果没有token
    if (whiteList.includes(to.path)) {
      // 如果在白名单中，则直接放行
      next();
    } else {
      next({ path: '/login' });
    }
  }
});

export default router;
