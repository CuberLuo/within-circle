<template>
  <van-tabbar route>
    <van-tabbar-item icon="home-o" to="/index">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/map">地图</van-tabbar-item>
    <van-tabbar-item icon="add" to="/post" id="post-icon" />
    <van-tabbar-item icon="friends-o" to="/message">消息</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="/me">我</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
const route = useRoute()
watch(route, (newRoute) => {
  console.log(newRoute.path)
})
</script>

<style scoped>
.van-tabbar-item#post-icon {
  --van-tabbar-item-icon-size: 40px !important;
  color: #1989fa !important;
}
:deep().van-tabbar-item--active .van-icon {
  filter: drop-shadow(2px 2px 16px #409eff);
}
</style>
