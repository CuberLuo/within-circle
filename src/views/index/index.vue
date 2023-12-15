<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh" success-text="刷新成功">
    <van-space direction="vertical" fill>
      <van-cell class="user-post-cell" v-for="post in postsArr" :key="post.id">
        <div class="user-cell-info">
          <van-image round fit="cover" class="user-avatar" :src="post.userAvatar" />
          <div class="post-source">
            <div class="user-name">{{ post.username }}</div>
            <div class="post-date">{{ post.postDate }}</div>
          </div>
          <div class="cell-like">
            <van-button
              round
              size="small"
              icon="good-job-o"
              class="like-btn"
              @click="likeIt(post.id)"
            >
              {{ post.likeNum }}
            </van-button>
          </div>
        </div>
        <div class="user-cell-content">
          {{ post.postContent }}
        </div>
        <van-space :size="5" class="post-images">
          <div class="img-wrapper" v-for="imgs in post.postImages" :key="imgs.id">
            <van-image
              class="post-image"
              fit="cover"
              :src="imgs.imgUrl"
              lazy-load
              @click="showImage(imgs.id, post.postImages)"
            />
          </div>
        </van-space>
        <van-space>
          <van-tag plain type="primary">
            <van-icon name="location" />
            <span>{{ post.location.name }}</span>
          </van-tag>
          <!-- <van-tag plain type="warning">
          <van-icon name="lock" />
          <span>{{ post.visibleCircle }}</span>
        </van-tag> -->
        </van-space>
      </van-cell>
    </van-space>
  </van-pull-refresh>
</template>

<script setup>
import { getAllPosts } from '@/api/post.js'
import { showImagePreview } from 'vant'

const loading = ref(false)
const postsArr = ref([])
onMounted(() => {
  requestNewAllPosts()
})
const requestNewAllPosts = async () => {
  try {
    const res = await getAllPosts()
    postsArr.value = res.data
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
const onRefresh = async () => {
  setTimeout(() => {}, 1000)
  const status = await requestNewAllPosts()
  loading.value = false
}
const showImage = (id, images) => {
  console.log(id)
  console.log(images)
  console.log(images.map((image) => image.imgUrl))
  showImagePreview({
    images: images.map((image) => image.imgUrl),
    startPosition: id
  })
}
const likeIt = (postId) => {
  console.log(postId)
}
</script>

<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;
}

:deep().van-cell__value {
  text-align: left;
}
.user-cell-info {
  display: flex;
  align-items: center;
}
.post-source {
  margin-left: 8px;
}
.cell-like {
  flex: 1;
  text-align: right;
}
.post-images {
  width: 100%;
}

.post-image {
  width: calc((100vw - var(--van-cell-horizontal-padding) * 2 - 15px) / 3);
  aspect-ratio: 1 / 1;
}
</style>
