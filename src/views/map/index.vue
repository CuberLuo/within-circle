<template>
  <div>
    <div id="container"></div>
    <van-popup
      v-model:show="showPointPopup"
      round
      class="point-popup"
      closeable
      :close-on-click-overlay="false"
    >
      <UserPostCell :post="curPost" />
    </van-popup>
  </div>
</template>

<script setup>
defineOptions({
  name: 'amap'
})
import AMapLoader from '@amap/amap-jsapi-loader'
import amap from '@/components/data/amap.json'
import { getUserInfo } from '@/api/userinfo'
import { getAllPosts } from '@/api/post.js'
import UserPostCell from '@/components/UserPostCell.vue'
let map = null
let points = []
const avatarUrl = ref('')
const showPointPopup = ref(false)
const pointPostContent = ref('')
const curPost = ref()
onMounted(async () => {
  showLoadingToast({
    message: '地图加载中',
    forbidClick: true,
    duration: 0
  })
  await getUserAvatar()
  await getAllPostPoints()
  console.log(points)
  AMapLoader.load({
    key: amap.key,
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.MarkerCluster']
  }).then((AMap) => {
    map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 18,
      center: [120.048268, 30.233088]
    })
    const geolocation = new AMap.Geolocation({
      useNative: true,
      timeout: 10 * 1000,
      maximumAge: 100, //定位结果缓存100毫秒
      showCircle: false, //定位精度范围不显示
      enableHighAccuracy: true, //使用高精度定位
      markerOptions: {
        content: `
          <img src="${avatarUrl.value}" 
          style="width:30px;height:30px;border-radius:50%;"/>
          `
      }
    })
    map.addControl(geolocation)

    geolocation.getCurrentPosition(function (status, result) {
      if (status == 'complete') {
        console.log('定位成功', result)
        closeToast()
      } else {
        console.log('定位失败', result)
        showFailToast('无法获取当前定位')
      }
    })

    //以下是聚合点展示代码
    var gridSize = 60
    var count = points.length
    var _renderClusterMarker = function (context) {
      var factor = Math.pow(context.count / count, 1 / 18)
      var div = document.createElement('div')
      var Hue = 180 - factor * 180
      var bgColor = 'hsla(' + Hue + ',100%,40%,0.7)'
      var fontColor = 'hsla(' + Hue + ',100%,90%,1)'
      var borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      var shadowColor = 'hsla(' + Hue + ',100%,90%,1)'
      div.style.backgroundColor = bgColor
      var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 5px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    }
    var _renderMarker = function (context) {
      const { marker, data } = context
      const { pointDetails } = data[0]
      const posterAvatar = pointDetails.userAvatar
      //在同一个点的头像,最近发布的显示在最上面
      var content = `
          <img src="${posterAvatar}" 
          style="width:30px;height:30px;border-radius:50%;"/>
          `
      var offset = new AMap.Pixel(-9, -9)
      marker.setContent(content)
      marker.setOffset(offset)

      /* marker.on('click', () => {
        console.log(pointDetails)
        curPost.value = pointDetails
        console.log('点击point')
        showPointPopup.value = true
      }) */
    }
    var cluster = new AMap.MarkerCluster(map, points, {
      gridSize: gridSize, // 设置网格像素大小
      renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
      renderMarker: _renderMarker // 自定义非聚合点样式
    })
  })
})

const getUserAvatar = async () => {
  try {
    const res = await getUserInfo()
    const { data } = res
    avatarUrl.value = data.avatarUrl
  } catch (error) {
    console.log(error)
  }
}

const getAllPostPoints = async () => {
  try {
    const res = await getAllPosts()
    const posts = res.data
    for (const post of posts.reverse()) {
      //根据发布时间先后依次渲染
      const { lat, lon } = post.location
      const point = {
        lnglat: [lon, lat],
        pointDetails: post
      }
      points.push(point)
    }
  } catch (error) {
    console.log(error)
  }
}
onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
/* 样式穿透 */
:deep() .amap-copyright {
  /* 去除高德地图copyright水印 */
  display: none !important;
}
#container {
  width: 100%;
  /* 注意使用calc时减号左右要有空格 */
  height: calc(100vh - var(--van-nav-bar-height) - var(--van-tabbar-height));
}

.point-popup {
  width: 100vw;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
