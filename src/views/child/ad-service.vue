<template>
  <div>
    <micro-app name="ad-service" :url="subAppUrl" iframe keep-alive></micro-app>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const subAppUrl = computed(() => `http://localhost:5180${route.path}`);
</script>

<style scoped lang="scss"></style>
