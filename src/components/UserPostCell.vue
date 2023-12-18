<template>
  <van-cell class="user-post-cell">
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
          :class="post.userLike ? 'like-btn' : ''"
          @click="likeIt(post)"
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
</template>

<script setup>
import { likePost } from '@/api/post.js'
import { showImagePreview } from 'vant'
const props = defineProps({
  post: {
    type: Object
  }
})
const showImage = (id, images) => {
  console.log(id)
  console.log(images)
  console.log(images.map((image) => image.imgUrl))
  showImagePreview({
    images: images.map((image) => image.imgUrl),
    startPosition: id
  })
}
const likeIt = async (post) => {
  if (post.userLike) post.likeNum -= 1
  else post.likeNum += 1
  post.userLike = !post.userLike
  try {
    const res = await likePost({
      postId: post.id
    })
    showToast(res.msg)
  } catch (error) {
    console.log(error)
  }
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
.like-btn {
  color: orange;
  border-color: orange;
}
</style>
