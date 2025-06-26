<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import commonHeader from '@/components/commonHeader.vue';
import commonFooter from '@/components/commonFooter.vue';
import mainContainer from '@/components/mainContainer.vue';
import { useUserStore } from '@/store/user';

const route = useRoute();
const userStore = useUserStore();

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token && !userStore.userInfo) {
    userStore.fetchUserProfile().catch((error: any) => {
      console.error('恢复会话失败:', error);
    });
  }
});
</script>

<template>
  <common-header v-if="route.name !== 'login'" />
  <main-container />
  <common-footer v-if="route.name !== 'login'" />
</template>

<style scoped lang="scss"></style>
