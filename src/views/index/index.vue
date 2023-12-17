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
    </van-space>
    <van-loading id="loading-spinner" type="spinner" v-show="!isGetAll" />
  </van-pull-refresh>
</template>

<script setup>
import { getAllPosts, getPageSizePosts, likePost } from '@/api/post.js'
import { showImagePreview } from 'vant'
const route = useRoute()
watch(route, (newRoute) => {
  if (newRoute.path == '/index' && newRoute.query.reloadPage == '1') {
    resetData()
    requestPageSizePosts()
  }
})

const loading = ref(false)
const postsArr = ref([])
const page = ref(1)
const pageSize = 5
const reachBottom = ref(false)
const isGetAll = ref(false)
const resetData = () => {
  postsArr.value = []
  page.value = 1
  reachBottom.value = false
  isGetAll.value = false
}
onMounted(() => {
  requestPageSizePosts()
  window.addEventListener('scroll', lazyLoading)
})
const lazyLoading = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop //滚动条高度
  const clientHeight = document.documentElement.clientHeight //屏幕可视区域高度
  const scrollHeight = document.documentElement.scrollHeight //浏览器所有内容高度

  //触底
  if (scrollTop + clientHeight + 1 >= scrollHeight && !reachBottom.value) {
    reachBottom.value = true
    // showToast('触底啦!!!')
    if (isGetAll.value === false) {
      page.value++
      //滚动到底的时候，当前页需要加1
      requestPageSizePosts()
    }
  }
  //离开底部
  if (scrollTop + clientHeight + 1 < scrollHeight && reachBottom.value) {
    reachBottom.value = false
  }
}
const requestPageSizePosts = async () => {
  const res = await getPageSizePosts({
    page: page.value,
    pageSize: pageSize
  })
  console.log(res.data)
  const record_cnt = res.data.length
  if (record_cnt < pageSize) {
    isGetAll.value = true
  }
  postsArr.value.push(...res.data)
}
const onRefresh = async () => {
  resetData()
  await requestPageSizePosts()
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
#loading-spinner {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
