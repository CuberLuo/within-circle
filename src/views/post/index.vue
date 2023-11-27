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
          <van-uploader accept="*" v-model="picList" multiple :max-count="3" />
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
const postAll = () => {
  if (message.value.trim() == '') showFailToast('文本内容不能为空')
  if (location.value.length == 0) showFailToast('地点不能为空')
  if (visibleCircle.value) showFailToast('可见范围不能为空')
  console.log(message.value)
  console.log(picList.value)
  console.log(location.value)
  console.log(visibleCircle.value)
}
</script>

<style scoped>
.inputCell,
.picUpload,
.opCell {
  margin-top: 12px;
}
</style>
