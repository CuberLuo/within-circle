<template>
  <div>
    <van-empty
      v-if="postsArr.length == 0 && !loading"
      :image="emptyImg"
      image-size="100"
      description="此处空空如也"
    />
    <van-pull-refresh
      v-else
      v-model="loading"
      @refresh="onRefresh"
      success-text="刷新成功"
      class="pull-refresh"
    >
      <van-space direction="vertical" fill>
        <div v-for="post in postsArr" :key="post.id">
          <UserPostCell :post="post" @deletePostFromPostsArr="deletePostFromPostsArr" />
        </div>
      </van-space>
      <van-loading id="loading-spinner" type="spinner" v-show="showLoading" />
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { getPageSizePosts } from '@/api/post.js'
import UserPostCell from '@/components/UserPostCell.vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import amap from '@/components/data/amap.json'
const lat = ref(-1)
const lng = ref(-1)

/* const getPostsByLocation = async () => {
  const AMap = await AMapLoader.load({
    key: amap.key,
    version: '2.0',
    plugins: ['AMap.Geolocation']
  })
  const geolocation = new AMap.Geolocation({
    useNative: true,
    timeout: 10 * 1000,
    maximumAge: 100, //定位结果缓存100毫秒
    enableHighAccuracy: true //使用高精度定位
  })
  geolocation.getCurrentPosition(function (status, result) {
    if (status == 'complete') {
      console.log('首页定位成功', result)
      lat.value = result.position.lat
      lng.value = result.position.lng
      console.log(lat.value)
      console.log(lng.value)
      requestPageSizePosts()
    } else {
      console.log('首页定位失败', result)
      showFailToast('无法获取当前定位')
    }
  })
} */

const emptyImg = new URL('@/assets/images/empty-image.png', import.meta.url).href
const route = useRoute()
watch(route, (newRoute) => {
  if (newRoute.path == '/index' && newRoute.query.reloadPage == '1') {
    resetData()
    requestPageSizePosts()
  }
})

const loading = ref(false)
const showLoading = ref(false)
const postsArr = ref([])
const page = ref(1)
const pageSize = 5
const lastPostId = ref(-1)
const reachBottom = ref(false)
const isGetAll = ref(false)
const resetData = () => {
  postsArr.value = []
  page.value = 1
  reachBottom.value = false
  isGetAll.value = false
}
onMounted(async () => {
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

    if (isGetAll.value === false) {
      page.value++
      showLoading.value = true
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
    page_size: pageSize
  })
  console.log(res.data)
  const record_cnt = res.data.length
  if (record_cnt < pageSize) {
    showLoading.value = false
    isGetAll.value = true
  }
  postsArr.value.push(...res.data)
}
const onRefresh = async () => {
  resetData()
  await requestPageSizePosts()
  loading.value = false
}
const deletePostFromPostsArr = (id) => {
  console.log(id)
  resetData()
  requestPageSizePosts()
  // postsArr.value = postsArr.value.filter((post) => post.id !== id)
}
</script>

<style scoped>
#loading-spinner {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.pull-refresh {
  min-height: calc(100vh - var(--van-nav-bar-height) - var(--van-tabbar-height));
}
</style>
