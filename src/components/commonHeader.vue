<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import microApp from '@micro-zoe/micro-app';

const activeIndex = ref('dashboard');
const router = useRouter();
const { proxy } = getCurrentInstance();

// --- 初始化全局状态 ---
const initialToken = localStorage.getItem('token');
if (initialToken && !microApp.getGlobalData()?.token) {
  microApp.setGlobalData({ token: initialToken });
}

// 创建一个响应式的ref来存储全局数据
const globalData = ref(microApp.getGlobalData());

// 定义监听函数
const dataListener = (data) => {
  // 当数据变化时，更新ref
  globalData.value = { ...data };
};

onMounted(() => {
  // 组件挂载时添加监听
  microApp.addDataListener(dataListener, true);
});

onUnmounted(() => {
  // 组件卸载时移除监听
  microApp.removeDataListener(dataListener);
});

const handleSelect = (key) => {
  switch (key) {
    case 'dashboard':
      router.push({ name: 'home' });
      break;
    case 'campaigns':
      router.push({ name: 'childJob' });
      break;
    case 'audiences':
      router.push({ name: 'childEnterprise' });
      break;
    case 'reports':
      router.push({ name: 'childAbout' });
      break;
  }
};

function logout() {
  // 1. 清除本地存储
  localStorage.removeItem('token');
  // 2. 清除micro-app全局数据
  microApp.clearGlobalData();
  // 3. 提示并刷新
  proxy.$message.success('退出成功');
  router.push({ name: 'login' }); 
}
</script>

<template>
  <div class="common-header">
    <div class="header-container">
      <span class="logo">星链矩阵</span>
      <el-menu
        :default-active="activeIndex"
        background-color="transparent"
        text-color="#ffffff"
        mode="horizontal"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="dashboard">概览</el-menu-item>
        <el-menu-item index="campaigns">广告系列</el-menu-item>
        <el-menu-item index="audiences">受众管理</el-menu-item>
        <el-menu-item index="reports">数据报告</el-menu-item>
      </el-menu>
      <div class="actions">
        <el-button
          round
          size="small"
          v-if="globalData && globalData.token"
          @click="logout"
          class="logout-btn"
        >
          退出
        </el-button>
        <el-button
          round
          size="small"
          v-else
          @click="() => router.push({ name: 'login' })"
          class="login-btn"
        >
          登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-header {
  background-color: #202329;
  height: 60px;
  display: flex;
  justify-content: center;

  .header-container {
    width: 1200px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .logo {
    color: #ffd04b;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  .el-menu {
    flex: 1;
    height: 100%;
    border-bottom: none;
    display: flex;
    justify-content: center;
    background-color: transparent;

    &.el-menu--horizontal {
      border-bottom: none;
    }

    .el-menu-item {
      height: 100%;
      background-color: transparent !important;

      &:hover {
        background-color: transparent !important;
        color: #ffd04b !important;
      }
    }
  }

  .actions {
    .el-button {
      width: 88px;
      height: 36px;
      border: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.3s ease;

      &.login-btn {
        background: linear-gradient(45deg, #ffd04b, #ff7e5f);
        color: #ffffff;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 208, 75, 0.4);
        }
      }

      &.logout-btn {
        background-color: rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
      }
    }
  }
}
</style>
