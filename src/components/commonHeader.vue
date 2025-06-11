<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import loginApi from '@/api/loginApi';
import microApp from '@micro-zoe/micro-app';

const activeIndex = ref('dashboard');
const router = useRouter();
const globalData = microApp.getGlobalData();
const { proxy } = getCurrentInstance();

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
  loginApi.logout({}).then((res) => {
    const { success, message } = res;
    if (success) {
      microApp.clearGlobalData();
      proxy.$message.success('退出成功');
      router.go(0);
    } else {
      proxy.$message.error(message);
    }
  });
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
        <el-button round plain size="small" v-if="globalData && globalData.token" @click="logout"
          >退出</el-button
        >
        <el-button round plain size="small" v-else @click="() => router.push({ name: 'login' })"
          >登录</el-button
        >
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
      width: 80px;
      background: transparent;
    }
  }
}
</style>
