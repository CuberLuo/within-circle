<template>
  <div>
    <EmptyError v-if="postsArr.length == 0 && !loading" description="暂无推荐内容" />
    <div v-else>
      <van-pull-refresh v-model="loading" @refresh="onRefresh" success-text="刷新成功">
        <van-space direction="vertical" fill>
          <div v-for="post in postsArr" :key="post.id">
            <UserPostCell :post="post" @deletePostFromPostsArr="deletePostFromPostsArr" />
          </div>
        </van-space>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { getTopKRecommendPosts } from '@/api/post.js'

const loading = ref(false)
const postsArr = ref([])

const requestTopKRecommendPosts = async () => {
  try {
    const res = await getTopKRecommendPosts({
      size_k: 5
    })
    postsArr.value = res.data
  } catch (e) {
    console.log(e)
  }
}

const onRefresh = async () => {
  await requestTopKRecommendPosts()
  loading.value = false
}
const deletePostFromPostsArr = (id) => {
  requestTopKRecommendPosts()
}

onMounted(() => {
  requestTopKRecommendPosts()
})
</script>

<style scoped></style>
