<template>
  <van-nav-bar :title="navBarTitle" />
</template>

<script setup>
const route = useRoute()
const navBarTitle = ref(route.meta.title)
watch(route, (newRoute) => {
  navBarTitle.value = newRoute.meta.title
})
</script>

<style scoped></style>
