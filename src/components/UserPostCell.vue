<template>
  <PosterPopup v-model="showPopup" :posterId="curPosterId" />
  <van-cell class="user-post-cell">
    <div class="user-cell-info">
      <van-image
        round
        fit="cover"
        class="user-avatar"
        :src="post.user_avatar"
        @click="showPosterDetails(post.user_id)"
      />
      <div class="post-source">
        <div class="user-name">{{ post.username }}</div>
        <div class="post-date">{{ post.post_date }}</div>
      </div>
      <div class="cell-operate">
        <div v-if="post.is_my_post" class="cell-delete">
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
            :class="post.user_like ? 'like-btn' : ''"
            @click="likeIt(post)"
          >
            {{ post.like_num }}
          </van-button>
        </div>
      </div>
    </div>
    <div class="user-cell-content">
      {{ post.post_content }}
    </div>
    <van-space :size="5" class="post-images">
      <div class="img-wrapper" v-for="imgs in post.post_images" :key="imgs.id">
        <van-image
          class="post-image"
          fit="cover"
          :src="imgs.img_url"
          lazy-load
          @click="showImage(imgs.id, post.post_images)"
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
          <span>{{ post.visible_circle }}</span>
        </van-tag> -->
    </van-space>
  </van-cell>
</template>

<script setup>
import { likePost, deletePost } from '@/api/post.js'
import { showImagePreview } from 'vant'
import PosterPopup from './PosterPopup.vue'
const props = defineProps({
  post: Object
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
  if (post.user_like) post.like_num -= 1
  else post.like_num += 1
  post.user_like = !post.user_like
  try {
    const res = await likePost({
      post_id: post.id
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
          post_id: id
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
