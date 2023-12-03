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
          <van-uploader v-model="picList" multiple :max-count="3" />
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
import AddLocation from './AddLocation.vue'
import VisibleCircle from './VisibleCircle.vue'
import { uploadPost } from '@/api/post.js'
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
    if (res.code == 10000) {
      showSuccessToast(res.msg)
    } else showFailToast(res.msg)
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
