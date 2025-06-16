<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import microApp from '@micro-zoe/micro-app';

const router = useRouter();
const route = useRoute();

const activeIndex = ref([]);

// --- 初始化全局状态 ---
const initialToken = localStorage.getItem('token');
if (initialToken && !microApp.getGlobalData()?.token) {
  microApp.setGlobalData({ token: initialToken });
}

// 创建一个响应式的ref来存储全局数据
const globalData = ref(microApp.getGlobalData());

// 定义监听函数
const dataListener = (data) => {
  globalData.value = { ...data };
};

onMounted(() => {
  microApp.addDataListener(dataListener, true);
});

onUnmounted(() => {
  microApp.removeDataListener(dataListener);
});

// 监听路由变化，更新激活菜单项
watch(
  () => route.name,
  (name) => {
    if (typeof name === 'string') {
      activeIndex.value = [name];
    }
  },
  { immediate: true },
);

const handleMenuClick = (e) => {
  router.push({ name: e.key });
};

function logout() {
  localStorage.removeItem('token');
  microApp.clearGlobalData();
  message.success('退出成功');
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="common-header">
    <div class="header-container">
      <span class="logo">星链矩阵</span>
      <div class="menu-container">
        <a-menu
          v-model:selectedKeys="activeIndex"
          theme="dark"
          mode="horizontal"
          :style="{
            lineHeight: '60px',
            backgroundColor: '#202329',
            flex: 1,
            justifyContent: 'center',
          }"
          @click="handleMenuClick"
        >
          <a-sub-menu key="data-analysis">
            <template #title>数据分析</template>
            <a-menu-item key="adReports">广告报表</a-menu-item>
            <a-menu-item key="salesAnalysis">销售分析</a-menu-item>
            <a-menu-item key="acosRoiAnalysis">ACoS & ROI 分析</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="ad-management">
            <template #title>广告管理</template>
            <a-menu-item key="campaignManage">广告计划管理</a-menu-item>
            <a-menu-item key="campaignCreate">创建广告计划</a-menu-item>
            <a-menu-item key="campaignGroups">广告组 & 广告单元</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="product-management">
            <template #title>商品管理</template>
            <a-menu-item key="productsList">商品列表</a-menu-item>
            <a-menu-item key="productsFilter">投放商品筛选</a-menu-item>
            <a-menu-item key="productsSuggest">投放建议</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="finance-center">
            <template #title>财务中心</template>
            <a-menu-item key="financeSpend">广告花费明细</a-menu-item>
            <a-menu-item key="financeFba">FBA费用 & 佣金</a-menu-item>
            <a-menu-item key="financeExport">报表导出</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <div class="actions">
        <a-button v-if="globalData && globalData.token" @click="logout" class="logout-btn" ghost>
          退出
        </a-button>
        <a-button
          v-else
          type="primary"
          shape="round"
          class="login-btn"
          @click="() => router.push({ name: 'login' })"
        >
          登录
        </a-button>
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
  position: relative;
  z-index: 100;

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
    margin-right: 40px;
  }

  .menu-container {
    display: flex;
    flex: 1;
    margin-right: 300px;
  }

  .actions {
    margin-left: 40px;

    .login-btn {
      background: linear-gradient(45deg, #ffd04b, #ff7e5f);
      border-color: transparent;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 208, 75, 0.4);
      }
    }

    .logout-btn {
      border-color: #f0f0f0;
      color: #f0f0f0;
      &:hover {
        border-color: #ffffff;
        color: #ffffff;
      }
    }
  }
}
</style>
