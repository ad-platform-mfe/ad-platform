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

export default router;
