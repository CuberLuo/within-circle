<template>
  <EmptyError v-if="followerList.length == 0" description="您暂未关注任何人" />
  <div v-else>
    <van-cell v-for="follower in followerList" :key="follower.id" class="user-cell">
      <template #value>
        <div class="user-cv">
          <van-image
            round
            class="user-img"
            :src="follower.avatar_url"
            @click="privateChat(follower)"
          />
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
      user_id: follower.id
    })
    if (res.code == status_code.OK) {
      follower.follow = !follower.follow
      showToast(res.msg)
    }
  } catch (error) {
    console.log(error)
  }
}

const privateChat = (user) => {
  router.push({
    path: '/chat',
    query: {
      chatUserId: user.id,
      chatUsername: user.username,
      chatUserAvatar: user.avatar_url,
      type: 'private'
    }
  })
}
</script>

<style src="@/assets/styles/userinfo.css" scoped />
