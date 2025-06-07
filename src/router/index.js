import login from '@/views/main/login.vue'
import childHomeView from '@/views/child/childHome.vue'
import childJob from '@/views/child/childJob.vue'
import childEnterprise from '@/views/child/childEnterprise.vue'
import childAbout from '@/views/child/childAbout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/childHomeView',
    name: 'childHomeView',
    component: childHomeView,
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/childJob',
    name: 'childJob',
    component: childJob,
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/childEnterprise',
    name: 'childEnterprise',
    component: childEnterprise,
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/childAbout',
    name: 'childAbout',
    component: childAbout,
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/main/HomeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router