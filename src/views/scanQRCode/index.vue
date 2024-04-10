<template>
  <div class="qrcode-scan-wrapper">
    <div class="torch-wrapper" v-if="cameraReady">
      <van-button
        icon="bulb-o"
        type="primary"
        plain
        :color="torchActive && !torchLoading ? '#ffcf29' : ''"
        :disabled="torchNotSupported"
        :loading="torchLoading"
        @click="torchClick"
      />
    </div>
    <div class="uploader-wrapper" v-if="cameraReady">
      <van-button icon="photo" type="primary" plain />
      <qrcode-capture
        class="qrcode-capture"
        @change="onChangeImgFile"
        @detect="onDetect"
        capture="environment"
      />
    </div>

    <qrcode-stream
      v-if="selectedDevice !== null"
      :paused="paused"
      :constraints="{ deviceId: selectedDevice.deviceId }"
      :track="paintOutline"
      :torch="torchActive"
      @camera-on="onReady"
      @error="onError"
      @detect="onDetect"
      v-memo="[torchActive, selectedDevice.deviceId]"
    />
  </div>
</template>

<script setup>
defineOptions({
  name: 'scanQRCode'
})
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader'

const cameraReady = ref(false)
const selectedDevice = ref(null)
const devices = ref([])
const paused = ref(false)
const torchActive = ref(false)
const torchNotSupported = ref(false)
const torchLoading = ref(false)

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

const onChangeImgFile = (event) => {
  console.log(event.target.files)
  showLoadingToast({
    message: '扫描中',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
}
const onDetect = async (detectedCodes) => {
  closeToast()
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
      router.push('/me')
    })
  }
}
const onError = (err) => {
  console.log(err)
  showFailToast('相机初始化失败')
}
const onReady = (capabilities) => {
  torchNotSupported.value = !capabilities.torch
  closeToast()
  torchLoading.value = false
  cameraReady.value = true
}
const torchClick = () => {
  torchLoading.value = true
  showLoadingToast({
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  torchActive.value = !torchActive.value
}

onMounted(async () => {
  showLoadingToast({
    message: '相机加载中',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  const deviceInfo = await navigator.mediaDevices.enumerateDevices()
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
.torch-wrapper,
.uploader-wrapper {
  position: absolute;
  z-index: 10;
  bottom: calc(var(--van-tabbar-height) + 40px);
}
.torch-wrapper {
  left: 40px;
}
.uploader-wrapper {
  display: inline-block;
  right: 40px;
}
.uploader-wrapper button,
.torch-wrapper button {
  background-color: rgba(255, 255, 255, 0.7);
}
.qrcode-capture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
</style>
