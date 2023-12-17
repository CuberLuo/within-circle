<template>
  <div id="container"></div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import amap from '@/components/data/amap.json'
import { getUserInfo } from '@/api/userinfo'
let map = null
const avatarUrl = ref('')
onMounted(async () => {
  showLoadingToast({
    message: '地图加载中',
    forbidClick: true,
    duration: 0
  })
  try {
    const res = await getUserInfo()
    const { data } = res
    avatarUrl.value = data.avatarUrl
  } catch (error) {
    console.log(error)
  }

  AMapLoader.load({
    key: amap.key,
    version: '2.0',
    plugins: ['AMap.Geolocation']
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
  })
})
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
</style>
