<template>
  <van-tabbar route active-color="#333333" inactive-color="#9c9ca5">
    <van-tabbar-item icon="home-o" to="/index">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/map">地图</van-tabbar-item>
    <van-tabbar-item icon="add" to="/post" id="post-icon" />
    <van-tabbar-item icon="friends-o" to="/message">消息</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="/me">我</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.van-tabbar-item#post-icon {
  --van-tabbar-item-icon-size: 40px !important;
  color: #1989fa !important;
}
</style>
