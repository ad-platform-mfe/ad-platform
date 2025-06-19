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

function testGlobalData() {
  const testData = {
    from: '主应用 commonHeader',
    timestamp: Date.now(),
  };
  microApp.setGlobalData(testData);
  message.info('已发送测试全局数据，请在子应用控制台查看。');
}
</script>

<template>
  <div class="common-header">
    <div class="header-container">
      <img src="@/assets/images/logo.png" alt="汇量千川 Logo" class="logo" />
      <span class="logo-text">汇量千川</span>
      <div class="menu-container">
        <a-menu
          v-model:selectedKeys="activeIndex"
          theme="dark"
          mode="horizontal"
          class="header-menu"
          @click="handleMenuClick"
        >
          <a-sub-menu
            key="data-analysis"
            popup-class-name="header-submenu-popup"
            :popup-offset="[-18, 1]"
          >
            <template #title>数据分析</template>
            <a-menu-item key="adReports">广告报表</a-menu-item>
            <a-menu-item key="salesAnalysis">销售分析</a-menu-item>
            <a-menu-item key="acosRoiAnalysis">ACoS & ROI 分析</a-menu-item>
          </a-sub-menu>
          <a-sub-menu
            key="ad-management"
            popup-class-name="header-submenu-popup"
            :popup-offset="[-18, 1]"
          >
            <template #title>广告管理</template>
            <a-menu-item key="campaignManage">广告计划管理</a-menu-item>
            <a-menu-item key="adReview">广告审核</a-menu-item>
            <a-menu-item key="campaignGroups">广告组 & 广告单元</a-menu-item>
          </a-sub-menu>
          <a-sub-menu
            key="product-management"
            popup-class-name="header-submenu-popup"
            :popup-offset="[-18, 1]"
          >
            <template #title>商品管理</template>
            <a-menu-item key="productsList">商品列表</a-menu-item>
            <a-menu-item key="productsFilter">投放商品筛选</a-menu-item>
            <a-menu-item key="productsSuggest">投放建议</a-menu-item>
          </a-sub-menu>
          <a-sub-menu
            key="finance-center"
            popup-class-name="header-submenu-popup"
            :popup-offset="[-18, 1]"
          >
            <template #title>财务中心</template>
            <a-menu-item key="financeSpend">广告花费明细</a-menu-item>
            <a-menu-item key="financeFba">FBA费用 & 佣金</a-menu-item>
            <a-menu-item key="financeExport">报表导出</a-menu-item>
          </a-sub-menu>
          <a-sub-menu
            key="customer-service"
            popup-class-name="header-submenu-popup"
            :popup-offset="[-18, 1]"
          >
            <template #title>客服中心</template>
            <a-menu-item key="customer-service">客服中心</a-menu-item>
            <a-menu-item key="customer-message">申诉中心</a-menu-item>
            <a-menu-item key="customer-setting">客服配置</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <div class="actions">
        <a-button @click="testGlobalData" type="primary" style="margin-right: 15px">
          测试全局通信
        </a-button>
        <a-button v-if="globalData && globalData.token" @click="logout" class="logout-btn" ghost>
          退出
        </a-button>
        <a-button
          v-else
          type="primary"
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
  background-color: #1e293b;
  height: 60px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 100;
  border-bottom: 1px solid #334155;

  .header-container {
    width: 1200px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .logo {
    display: block;
    height: 32px;
    width: auto;
    cursor: pointer;
    margin-right: 8px;
  }
  .logo-text {
    color: #ffffff;
    // color: #9bc3fe;
    font-size: 24px;
    font-weight: bold;
  }

  .menu-container {
    display: flex;
    flex: 1;
    margin-right: 300px;
    height: 100%;
  }

  .actions {
    margin-left: auto;
    display: flex;
    align-items: center;

    .login-btn,
    .logout-btn {
      height: 34px;
      padding: 0 30px;
      font-size: 14px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
    }

    .login-btn {
      background-color: #38bdf8;
      border-color: #38bdf8;
      color: #0c4a6e;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        background-color: #7dd3fc;
        border-color: #7dd3fc;
        box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
      }
    }

    .logout-btn {
      border-color: #e2e8f0;
      color: #e2e8f0;
      transition: all 0.3s ease;
      &:hover {
        border-color: #6cb2f7;
        color: #4993f4;
      }
    }
  }
}

.header-menu {
  line-height: 59px;
  background-color: transparent;
  flex: 1;
  justify-content: center;
  border-bottom: none;

  :deep(.ant-menu-submenu-title:hover),
  :deep(.ant-menu-item-active) {
    color: #ffffff !important;
  }

  :deep(.ant-menu-item-selected) {
    color: #ffffff !important;
    background-color: transparent !important;
  }

  :deep(.ant-menu-item-selected::after) {
    border-bottom-color: #38bdf8 !important;
  }
}
</style>
