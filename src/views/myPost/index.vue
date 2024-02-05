<template>
  <EmptyError v-if="postsArr.length == 0" description="您暂未发布任何内容" />
  <div v-else>
    <van-space direction="vertical" fill>
      <div v-for="post in postsArr" :key="post.id">
        <UserPostCell :post="post" @deletePostFromPostsArr="deletePostFromPostsArr" />
      </div>
    </van-space>
  </div>
</template>

<script setup>
defineOptions({
  name: 'myPost'
})
import UserPostCell from '@/components/UserPostCell.vue'
import { getMyPosts } from '@/api/post.js'
const postsArr = ref([])
onMounted(async () => {
  try {
    const res = await getMyPosts()
    console.log(res.data)
    postsArr.value = res.data
  } catch (error) {
    console.log(error)
  }
})

const deletePostFromPostsArr = (id) => {
  postsArr.value = postsArr.value.filter((post) => post.id !== id)
}
</script>

<style scoped></style>
