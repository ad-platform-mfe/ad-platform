import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import login from '@/views/main/login.vue';
import adFinance from '@/views/child/ad-finance.vue';
import adHome from '@/views/main/ad-home.vue';
import adMaterial from '@/views/child/ad-material.vue';
import adShop from '@/views/child/ad-shop.vue';

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
    path: '/',
    redirect: '/ad-reports',
  },
  // --- 数据分析 ---
  {
    path: '/ad-reports',
    name: 'adReports',
    component: adHome,
    meta: { title: '广告报表', keepAlive: false },
  },
  {
    path: '/sales-analysis',
    name: 'salesAnalysis',
    component: adHome,
    meta: { title: '销售分析', keepAlive: false },
  },
  {
    path: '/acos-roi-analysis',
    name: 'acosRoiAnalysis',
    component: adHome,
    meta: { title: 'ACoS & ROI 分析', keepAlive: false },
  },
  // --- 广告管理 ---
  {
    path: '/campaign-manage',
    name: 'campaignManage',
    component: adMaterial,
    meta: { title: '广告计划管理', keepAlive: false },
  },
  {
    path: '/campaign-create',
    name: 'campaignCreate',
    component: adMaterial,
    meta: { title: '创建广告计划', keepAlive: false },
  },
  {
    path: '/campaign-groups',
    name: 'campaignGroups',
    component: adMaterial,
    meta: { title: '广告组 & 广告单元', keepAlive: false },
  },
  // --- 商品管理 ---
  {
    path: '/products-list',
    name: 'productsList',
    component: adShop,
    meta: { title: '商品列表', keepAlive: false },
  },
  {
    path: '/products-filter',
    name: 'productsFilter',
    component: adShop,
    meta: { title: '投放商品筛选', keepAlive: false },
  },
  {
    path: '/products-suggest',
    name: 'productsSuggest',
    component: adShop,
    meta: { title: '投放建议', keepAlive: false },
  },
  // --- 财务中心 ---
  {
    path: '/finance-spend',
    name: 'financeSpend',
    component: adFinance,
    meta: { title: '广告花费明细', keepAlive: false },
  },
  {
    path: '/finance-fba',
    name: 'financeFba',
    component: adFinance,
    meta: { title: 'FBA费用 & 佣金', keepAlive: false },
  },
  {
    path: '/finance-export',
    name: 'financeExport',
    component: adFinance,
    meta: { title: '报表导出', keepAlive: false },
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
