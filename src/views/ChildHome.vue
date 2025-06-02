<template>
  <div class="child-container">
    <micro-app 
      name="child-home" 
      url="http://localhost:3000/child-home/" 
      baseroute="/main/child-home"
      :data="microAppData"
      @created="handleCreated"
      @beforemount="handleBeforeMount"
      @mounted="handleMounted"
      @unmount="handleUnmount"
      @error="handleError"
    ></micro-app>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const microAppData = ref({
  type: 'child-home'
})

const handleCreated = () => {
  console.log('child-home created')
}

const handleBeforeMount = () => {
  console.log('child-home beforemount')
}

const handleMounted = () => {
  console.log('child-home mounted')
}

const handleUnmount = () => {
  console.log('child-home unmount')
}

const handleError = (e) => {
  console.error('child-home error:', e)
}
</script>

<style scoped>
.child-container {
  width: 100%;
  height: 100%;
}
</style> 