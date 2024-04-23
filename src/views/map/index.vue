<template>
  <div>
    <div id="container" v-show="!mapLoading"></div>
    <van-popup v-model:show="showPointPopup" round class="point-popup" closeable>
      <UserPostCell :post="curPost" />
    </van-popup>
  </div>
</template>

<script setup>
defineOptions({
  name: 'amap'
})
import AMapLoader from '@amap/amap-jsapi-loader'
import { getUserInfo } from '@/api/userinfo'
import { getAllPostsLocation, getPostById } from '@/api/post.js'
import UserPostCell from '@/components/UserPostCell.vue'
import { useThemeStore } from '@/stores/theme.js'
const theme = useThemeStore().theme
const mapTheme = `amap://styles/${theme == 'dark' ? 'darkblue' : 'normal'}`
let map = null
const mapLoading = ref(false)
let points = []
const avatarUrl = ref('')
const showPointPopup = ref(false)
const curPost = ref()
onMounted(async () => {
  mapLoading.value = true
  showLoadingToast({
    message: '地图加载中',
    forbidClick: true,
    duration: 0
  })
  await getUserAvatar()
  await getAllPostPoints()
  console.log(points)
  AMapLoader.load({
    key: import.meta.env.VITE_AMAP_KEY,
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.MarkerCluster']
  }).then((AMap) => {
    map = new AMap.Map('container', {
      mapStyle: mapTheme,
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
        <img src="${new URL('@/assets/images/userPositionMarker.png', import.meta.url).href}" 
        style="width:36px;height:36px"/>
        `,
        offset: new AMap.Pixel(-18, -36)
      }
    })
    map.addControl(geolocation)

    geolocation.getCurrentPosition(function (status, result) {
      if (status == 'complete') {
        console.log('定位成功', result)
        /* 等待地图加载完成并定位成功后延迟展示地图，防止地图暗黑模式下出现短暂白屏 */
        setTimeout(() => {
          mapLoading.value = false
          closeToast()
        }, 500)
      } else {
        console.log('定位失败', result)
        showFailToast('无法获取当前定位')
      }
    })

    /* geolocation.watchPosition(function (status, result) {
      //监控当前位置
      if (status == 'complete') {
        console.log('定位成功', result)
      } else {
        console.log('定位失败', result)
      }
    }) */

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
      const posterAvatar = pointDetails.user_avatar
      //在同一个点的头像,最近发布的显示在最上面
      var content = `
          <img src="${posterAvatar}"
          style="width:30px;height:30px;border-radius:50%;"/>
          `
      var offset = new AMap.Pixel(-9, -9)
      marker.setContent(content)
      marker.setOffset(offset)

      marker.on('click', () => getPostDetailById(pointDetails.id))
    }
    var cluster = new AMap.MarkerCluster(map, points, {
      gridSize: gridSize, // 设置网格像素大小
      renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
      renderMarker: _renderMarker // 自定义非聚合点样式
    })
  })
})

let flag = false

// const throttle = (callback, interval = 1500) => {
//   let flag = false
//   return function () {
//     if (flag) {
//       console.log('请求过于频繁，请稍后再试')
//       return
//     }
//     flag = true
//     setTimeout(() => {
//       callback.apply(this, arguments)
//       flag = false
//     }, interval)
//   }
// }

const getPostDetailById = async (post_id) => {
  // 利用函数节流的思想间接解决点击marker事件触发两次的问题
  if (flag) {
    console.log('请求过于频繁，请稍后再试')
    return
  }
  flag = true
  setTimeout(() => {
    flag = false
  }, 500)

  try {
    const res = await getPostById({ post_id })
    console.log(res)
    curPost.value = res.data[0]
    showPointPopup.value = true
  } catch (e) {
    console.log(e)
  }
}

const getUserAvatar = async () => {
  try {
    const res = await getUserInfo()
    const { data } = res
    avatarUrl.value = data.avatar_url
  } catch (error) {
    console.log(error)
  }
}

const getAllPostPoints = async () => {
  try {
    const res = await getAllPostsLocation()
    const posts = res.data
    for (const post of posts) {
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
  /* height: 40vh; */
  height: fit-content;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
