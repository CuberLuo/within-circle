<template>
  <div>
    <van-cell-group inset class="picUpload">
      <van-cell>
        <van-field
          v-model="message"
          rows="3"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="这一刻你想分享些什么?"
          show-word-limit
        />
      </van-cell>
      <van-cell>
        <template #title>
          <van-uploader v-model="picList" multiple :max-count="3" :before-read="beforeRead" />
        </template>
      </van-cell>
      <AddLocation @updateLocation="updateLocation" />
      <VisibleCircle @updateVisibleCircle="updateVisibleCircle" />

      <van-cell>
        <van-button
          round
          block
          text="发表"
          color="linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
          icon="share-o"
          id="postBtn"
          @click="postAll"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
defineOptions({
  name: 'post'
})
onBeforeRouteLeave(async (to, from) => {
  if (
    to.path == '/auth' ||
    (to.path == '/index' && to.query.reloadPage == '1') ||
    (message.value == '' && picList.value.length == 0)
  )
    return true

  const res = await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要离开当前页面吗？您的编辑发布前将不会保留!'
  })
  if (res == 'confirm') return true
  else return false
})
import AddLocation from './AddLocation.vue'
import VisibleCircle from './VisibleCircle.vue'
import { uploadPost } from '@/api/post.js'
import * as imageConversion from 'image-conversion'
const maxKiloBytes = 150
const beforeRead = async (file) => {
  console.log(file)
  const maxSize = maxKiloBytes * 1024
  if (Array.isArray(file)) {
    let compressedFileArray = []
    //同时上传多张图片时,file为文件数组
    for (const item of file) {
      if (item.size > maxSize) {
        const compressedFile = await compressFile(item)
        compressedFileArray.push(compressedFile)
      } else {
        compressedFileArray.push(item)
      }
    }
    console.log(compressedFileArray)
    return new Promise((resolve, reject) => resolve(compressedFileArray))
  } else if (file.size > maxSize) {
    const compressedFile = await compressFile(file)
    console.log(compressedFile)
    return new Promise((resolve, reject) => resolve(compressedFile))
  } else {
    return new Promise((resolve, reject) => resolve(file))
  }
}

const compressFile = async (file) => {
  showLoadingToast({
    message: '图片压缩中',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  // 超过maxKiloBytes kB的图片均会被压缩
  let res = await imageConversion.compressAccurately(file, maxKiloBytes)
  res = new File([res], file.name, { type: res.type, lastModified: Date.now() })
  closeToast()
  return res
}

const message = ref('')
const picList = ref([])
//TODO: 支持视频上传
const location = ref([])
const visibleCircle = ref(-1)
const updateLocation = (val) => {
  location.value = val
}
const updateVisibleCircle = (val) => {
  visibleCircle.value = val
}
const postAll = async () => {
  if (message.value.trim() == '') {
    showFailToast('文本内容不能为空')
    return
  }
  if (location.value.length == 0) {
    showFailToast('地点不能为空')
    return
  }
  if (visibleCircle.value == -1) {
    showFailToast('可见范围不能为空')
    return
  }
  showLoadingToast({
    message: '发布中',
    forbidClick: true,
    duration: 0
  })
  let formData = new FormData()
  for (let i = 0; i < picList.value.length; i++) {
    formData.append('picList', picList.value[i].file)
  }
  formData.append('message', message.value)
  formData.append('location', location.value)
  formData.append('visibleCircle', visibleCircle.value)
  try {
    const res = await uploadPost(formData)
    if (res.code == status_code.OK) {
      showSuccessToast(res.msg)
      router.push({
        path: '/index',
        query: { reloadPage: '1' }
      })
    }
  } catch (err) {
    console.log(err)
    showFailToast('发布出错')
  }
}
</script>

<style scoped>
.inputCell,
.picUpload,
.opCell {
  margin-top: 12px;
}
</style>
