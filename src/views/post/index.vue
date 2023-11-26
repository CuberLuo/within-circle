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
const visibleCircle = ref(0)
const updateLocation = (val) => {
  location.value = val
  console.log('location.value = val', val)
}
const updateVisibleCircle = (val) => {
  visibleCircle.value = val
  console.log('visibleCircle.value = val', val)
}
</script>

<style scoped>
.inputCell,
.picUpload,
.opCell {
  margin-top: 12px;
}
</style>
