<template>
  <van-popup v-model:show="showAvatarPopup" round class="avatar-popup" @close="closePopup">
    <h1>修改头像</h1>
    <van-uploader :before-read="beforeRead" :after-read="afterRead">
      <van-image round class="user-img" :src="userAvatarUrl" />
    </van-uploader>
    <van-button
      id="confirm-btn"
      type="primary"
      plain
      :disabled="uploadDisable"
      :loading="uploading"
      loading-text="上传中..."
      @click="confirmUpload"
    >
      确认修改
    </van-button>
  </van-popup>
</template>

<script setup>
const showAvatarPopup = ref(false)
const userAvatarUrl = ref('')
const userAvatar = ref()
const uploading = ref(false)
const uploadDisable = ref(true)
import { uploadUserAvatar } from '@/api/userinfo.js'
import * as imageConversion from 'image-conversion'
const props = defineProps({
  showPopup: {
    type: Boolean
  },
  avatarUrl: {
    type: String
  }
})
watch(
  () => props.showPopup,
  (newVal) => {
    showAvatarPopup.value = newVal
  }
)
watch(
  () => props.avatarUrl,
  (newVal) => {
    userAvatarUrl.value = newVal
  }
)
const emits = defineEmits(['updateShowPopup', 'updateUserAvatar'])
const closePopup = () => {
  emits('updateShowPopup', false)
}

const maxKiloBytes = 50
const beforeRead = async (file) => {
  const maxSize = maxKiloBytes * 1024
  if (file.size > maxSize) {
    const compressedFile = await compressFile(file)
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

const afterRead = (file) => {
  userAvatarUrl.value = file.objectUrl
  userAvatar.value = file
  uploadDisable.value = false
}

const confirmUpload = async () => {
  uploading.value = true
  let formData = new FormData()
  formData.append('pic', userAvatar.value.file)
  try {
    const res = await uploadUserAvatar(formData)
    if (res.code == 10000) {
      showSuccessToast(res.msg)
      closePopup()
      emits('updateUserAvatar', userAvatarUrl.value)
    } else showFailToast(res.msg)
  } catch (err) {
    console.log(err)
    showFailToast('上传出错')
  }
  uploading.value = false
  uploadDisable.value = true
}
</script>

<style scoped>
.avatar-popup {
  width: 80vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-img {
  width: 15vh;
  height: 15vh;
}
#confirm-btn {
  margin: 3.5vh 0;
}
</style>
