<template>
  <van-popup v-model:show="showPwdPopup" round class="pwd-popup" @close="closePopup">
    <h1>修改密码</h1>
    <van-space direction="vertical" fill>
      <van-cell-group inset>
        <van-field
          v-model="originalPwd"
          label="原密码"
          type="password"
          placeholder="请输入原密码"
          maxlength="15"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="newPwd"
          label="新密码"
          type="password"
          placeholder="请输入新密码"
          maxlength="15"
        />
        <van-field
          v-model="confirmNewPwd"
          label="确认密码"
          type="password"
          placeholder="请再次输入密码"
          maxlength="15"
        />
      </van-cell-group>
    </van-space>
    <van-button
      id="confirm-btn"
      type="primary"
      plain
      :loading="confirmLoading"
      loading-text="验证中..."
      @click="confirmChange"
    >
      确认修改
    </van-button>
  </van-popup>
</template>

<script setup>
import { pwdChange } from '@/api/user.js'
const showPwdPopup = ref(false)
const confirmLoading = ref(false)
const props = defineProps({
  showPopup: {
    type: Boolean
  }
})
watch(
  () => props.showPopup,
  (newVal) => {
    showPwdPopup.value = newVal
  }
)
const emits = defineEmits(['updateShowPopup'])
const closePopup = () => {
  emits('updateShowPopup', false)
}
const originalPwd = ref('')
const newPwd = ref('')
const confirmNewPwd = ref('')
const confirmChange = async () => {
  confirmLoading.value = true
  if (originalPwd.value == '') showFailToast('原密码不能为空')
  else if (newPwd.value == '') showFailToast('新密码不能为空')
  else if (confirmNewPwd.value == '') showFailToast('确认密码不能为空')
  else if (newPwd.value != confirmNewPwd.value) showFailToast('两次输入的密码不一致')
  else {
    try {
      const res = await pwdChange({
        originalPwd: originalPwd.value,
        newPwd: newPwd.value
      })
      if (res.code == status_code.OK) {
        showSuccessToast(res.msg)
        originalPwd.value = ''
        newPwd.value = ''
        confirmNewPwd.value = ''
        closePopup()
      }
    } catch (error) {
      console.log(error)
    }
  }
  confirmLoading.value = false
}
</script>

<style scoped>
.pwd-popup {
  width: 80vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep().van-cell {
  background: var(--van-background);
}
#confirm-btn {
  margin-top: 12px;
}
</style>
