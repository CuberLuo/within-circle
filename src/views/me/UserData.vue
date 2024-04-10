<template>
  <van-cell-group class="cell-group">
    <van-grid clickable :column-num="2">
      <van-grid-item @click="goToMyFollowPage()">
        <span class="info-number">{{ userDataObj.follower_num }}</span>
        <span class="info-text">关注</span>
      </van-grid-item>
      <van-grid-item @click="goToMyFansPage()">
        <span class="info-number">{{ userDataObj.fans_num }}</span>
        <span class="info-text">粉丝</span>
      </van-grid-item>
    </van-grid>
  </van-cell-group>
</template>

<script setup>
const props = defineProps({
  userDataObj: Object
})
const goToMyFollowPage = () => router.push('/myFollow')
const goToMyFansPage = () => router.push('/myFans')
</script>

<style scoped>
.cell-group {
  margin-bottom: 10px;
}
.info-number,
.info-text {
  font-size: 16px;
}
</style>
