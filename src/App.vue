<script setup>
import { useRoute } from 'vue-router';
import commonHeader from '@/components/commonHeader.vue';
import commonFooter from '@/components/commonFooter.vue';
import mainContainer from '@/components/mainContainer.vue';

const route = useRoute();
</script>

<template>
  <common-header v-if="route.name !== 'login'" />
  <main-container />
  <common-footer v-if="route.name !== 'login'" />
</template>

<style scoped lang="scss"></style>
