<template>
  <div class="qrcode-scan-wrapper">
    <qrcode-stream
      v-if="selectedDevice !== null"
      :paused="paused"
      :constraints="{ deviceId: selectedDevice.deviceId }"
      :track="trackFunctionSelected.value"
      @camera-on="onReady"
      @error="onError"
      @detect="onDetect"
    ></qrcode-stream>
  </div>
</template>

<script setup>
defineOptions({
  name: 'scanQRCode'
})
import { QrcodeStream } from 'vue-qrcode-reader'

const selectedDevice = ref(null)
const devices = ref([])
const paused = ref(false)

const trackFunctionSelected = ref({ text: 'outline', value: paintOutline })

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

const onDetect = async (detectedCodes) => {
  paused.value = true
  console.log(detectedCodes)
  // 检测到的二维码值数组
  const resultList = detectedCodes.map((code) => code.rawValue)
  // 默认取第一个二维码值
  const qrcodeValue = resultList[0]
  try {
    const qrCodeObj = JSON.parse(qrcodeValue)
    if (qrCodeObj.app == import.meta.env.VITE_APP_NAME) {
      console.log(qrCodeObj.userId)
      router.push({
        path: '/me',
        query: {
          scanUserId: qrCodeObj.userId
        }
      })
    } else {
      throw new Error('非方圆几里二维码')
    }
  } catch (e) {
    console.log(e)
    showDialog({ message: '无效二维码' }).then(() => {
      // 点击‘确定’后即可继续扫码
      paused.value = false
    })
  }
}
const onError = (err) => {
  console.log(err)
}
const onReady = (capabilities) => {
  console.log(capabilities)
  closeToast()
}

onMounted(async () => {
  showLoadingToast({
    message: '相机加载中',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  const deviceInfo = await navigator.mediaDevices.enumerateDevices()
  console.log(deviceInfo)
  devices.value = deviceInfo.filter(({ kind }) => kind === 'videoinput')
  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[devices.value.length - 1]
  }
})
</script>

<style scoped>
.qrcode-scan-wrapper {
  height: calc(100vh - var(--van-nav-bar-height) - var(--van-tabbar-height));
}
</style>
