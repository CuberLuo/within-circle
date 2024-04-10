<template>
  <div class="qrcode-scan-wrapper">
    <qrcode-stream
      v-if="selectedDevice !== null"
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

const onDetect = (detectedCodes) => {
  console.log(detectedCodes)
  // 检测到的二维码值数组
  const resultList = detectedCodes.map((code) => code.rawValue)
  // 默认取第一个二维码值
  showToast(resultList[0])
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
