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
import AMapLoader from '@amap/amap-jsapi-loader'
const lat = ref(-1)
const lng = ref(-1)

const loading = ref(false)
const postsArr = ref([])

const requestTopKRecommendPosts = async () => {
  showLoadingToast({
    message: '加载中',
    forbidClick: true,
    duration: 0
  })
  const AMap = await AMapLoader.load({
    key: import.meta.env.VITE_AMAP_KEY,
    version: '2.0',
    plugins: ['AMap.Geolocation']
  })
  const geolocation = new AMap.Geolocation({
    useNative: true,
    timeout: 10 * 1000,
    maximumAge: 100, //定位结果缓存100毫秒
    enableHighAccuracy: true //使用高精度定位
  })
  geolocation.getCurrentPosition(async function (status, result) {
    if (status == 'complete') {
      console.log('推荐页定位成功', result)
      lat.value = result.position.lat
      lng.value = result.position.lng
      console.log(lat.value)
      console.log(lng.value)
      try {
        const res = await getTopKRecommendPosts({
          size_k: 5,
          lat: lat.value,
          lon: lng.value
        })
        postsArr.value = res.data
        closeToast()
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('推荐页定位失败', result)
      showFailToast('无法获取当前定位')
    }
  })
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
