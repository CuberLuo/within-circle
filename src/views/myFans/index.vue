<template>
  <EmptyError v-if="fansList.length == 0" description="您暂时没有粉丝" />
  <div v-else>
    <van-cell v-for="fans in fansList" :key="fans.id" class="user-cell">
      <template #value>
        <div class="user-cv">
          <van-image round class="user-img" :src="fans.avatar_url" @click="privateChat(fans)" />
          <span class="user-info"> {{ fans.username }} </span>
          <div class="follow-wrapper">
            <van-button
              class="follow-btn"
              :text="fans.follow ? '已互关' : '回关'"
              @click="opUserFollow(fans)"
            />
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script setup>
defineOptions({
  name: 'myFans'
})
import { getMyFans, followUser } from '@/api/user.js'
const fansList = ref([])
onMounted(async () => {
  try {
    const res = await getMyFans()
    fansList.value = res.data
  } catch (error) {
    console.log(error)
  }
})
const opUserFollow = async (fans) => {
  try {
    const res = await followUser({
      user_id: fans.id
    })
    if (res.code == status_code.OK) {
      fans.follow = !fans.follow
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
