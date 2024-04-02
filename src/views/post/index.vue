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
      <TagSelector @updateTagSelector="updateTagSelector" />

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
import TagSelector from './TagSelector.vue'
import { uploadPost } from '@/api/post.js'
import { useBeforeReadMultiFile } from '@/mixins/fileCompress.js'

const beforeRead = (file) => {
  return useBeforeReadMultiFile(file, 150)
}

const message = ref('')
const picList = ref([])
//TODO: 支持视频上传
const location = ref([])
const visibleCircle = ref(-1)
const contentTag = ref('')

const updateLocation = (val) => {
  location.value = val
}
const updateVisibleCircle = (val) => {
  visibleCircle.value = val
}
const updateTagSelector = (val) => {
  contentTag.value = val
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
    formData.append('pic_list', picList.value[i].file)
  }
  formData.append('message', message.value)
  formData.append('location', location.value)
  formData.append('visible_circle', visibleCircle.value)
  formData.append('content_tag', contentTag.value)
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
