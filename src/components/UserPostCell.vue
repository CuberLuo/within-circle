<template>
  <PosterPopup :showPopup="showPopup" :posterId="curPosterId" @updateShowPopup="updateShowPopup" />
  <van-cell class="user-post-cell">
    <div class="user-cell-info">
      <van-image
        round
        fit="cover"
        class="user-avatar"
        :src="post.userAvatar"
        @click="showPosterDetails(post.userid)"
      />
      <div class="post-source">
        <div class="user-name">{{ post.username }}</div>
        <div class="post-date">{{ post.postDate }}</div>
      </div>
      <div class="cell-operate">
        <div v-if="post.isMyPost" class="cell-delete">
          <van-icon
            name="delete-o"
            color="#ee0a24"
            class="delete-icon"
            @click="deletePostCell(post.id)"
          />
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
import { likePost, deletePost } from '@/api/post.js'
import { showImagePreview } from 'vant'
import PosterPopup from './PosterPopup.vue'
const props = defineProps({
  post: {
    type: Object
  }
})
const curPosterId = ref()
const showPopup = ref(false)
const emits = defineEmits(['deletePostFromPostsArr'])
const showImage = (id, images) => {
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

const deletePostCell = (id) => {
  showConfirmDialog({
    title: '温馨提示',
    message: '您确认要删除该内容吗？'
  })
    .then(async () => {
      try {
        const res = await deletePost({
          postId: id
        })
        emits('deletePostFromPostsArr', id)
        showToast(res.msg)
      } catch (error) {
        console.log(error)
      }
    })
    .catch((e) => {})
}
const showPosterDetails = (posterId) => {
  curPosterId.value = posterId
  showPopup.value = true
}
const updateShowPopup = (val) => {
  showPopup.value = val
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
.cell-operate {
  /* flex设置为1表示宽度拉长填充父容器剩余的空间 */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.cell-delete {
  padding-right: 15px;
  display: flex;
  align-items: center;
}
.delete-icon {
  font-size: 25px;
}

.cell-like {
  /* flex: 1; */
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
