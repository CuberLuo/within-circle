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
import { uploadUserAvatar } from '@/api/userinfo.js'
import { useBeforeReadFile } from '@/mixins/fileCompress.js'
import { useUserInfo } from '@/mixins/userInfo.js'

const userAvatarUrl = ref('')
const userAvatar = ref()
const uploading = ref(false)
const uploadDisable = ref(true)
const showAvatarPopup = defineModel()
const props = defineProps({
  avatarUrl: String
})
watch(
  () => props.avatarUrl,
  (newVal) => {
    userAvatarUrl.value = newVal
  }
)
const emits = defineEmits(['updateUserAvatar'])
const closePopup = () => {
  showAvatarPopup.value = false
}

const beforeRead = (file) => {
  return useBeforeReadFile(file, 50)
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
    if (res.code == status_code.OK) {
      showSuccessToast(res.msg)
      closePopup()
      useUserInfo()
      emits('updateUserAvatar', userAvatarUrl.value)
    }
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
