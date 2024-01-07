<template>
  <div>
    <van-empty
      v-if="followerList.length == 0"
      :image="emptyImg"
      image-size="100"
      description="您暂未关注任何人"
    />
    <van-cell v-for="follower in followerList" :key="follower.id" class="user-cell">
      <template #value>
        <div class="user-cv">
          <van-image round class="user-img" :src="follower.avatarUrl" />
          <span class="user-info"> {{ follower.username }} </span>
          <div class="follow-wrapper">
            <van-button
              class="follow-btn"
              :text="follower.follow ? '已关注' : '关注'"
              @click="opUserFollow(follower)"
            />
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script setup>
defineOptions({
  name: 'myFollow'
})
import { getMyFollows, followUser } from '@/api/user.js'
const emptyImg = new URL('@/assets/images/empty-image.png', import.meta.url).href
const followerList = ref([])
onMounted(async () => {
  try {
    const res = await getMyFollows()
    followerList.value = res.data
  } catch (error) {
    console.log(error)
  }
})
const opUserFollow = async (follower) => {
  try {
    const res = await followUser({
      userId: follower.id
    })
    if (res.code == status_code.OK) {
      follower.follow = !follower.follow
      showToast(res.msg)
    } else {
      showFailToast(res.msg)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style src="@/assets/styles/userinfo.css" scoped />
