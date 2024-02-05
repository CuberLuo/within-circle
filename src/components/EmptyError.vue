<template>
  <van-empty :image="emptyImg" image-size="100" :description="description" />
</template>

<script setup>
const emptyImg = new URL('@/assets/images/empty-image.png', import.meta.url).href
const props = defineProps({
  description: String
})
</script>

<style scoped></style>
