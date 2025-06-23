<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const subAppUrl = computed(() => `http://localhost:5176${route.path}`);
</script>

<template>
  <div>
    <micro-app name="ad-material" :url="subAppUrl" iframe keep-alive></micro-app>
  </div>
</template>

<style></style>
