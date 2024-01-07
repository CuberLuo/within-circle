<template>
  <van-popup v-model:show="showPhoneBindPopup" round class="phone-bind-popup" @close="closePopup">
    <h1>手机号绑定</h1>
    <van-space direction="vertical" fill>
      <van-cell-group inset>
        <van-field
          v-model="phoneNum"
          label="手机号"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="smsCode"
          label="验证码"
          type="number"
          placeholder="请输入验证码"
          maxlength="5"
        >
          <template #button>
            <van-count-down
              ref="countDown"
              :time="time"
              :auto-start="false"
              @finish="onCountDownFinish"
            >
              <template #default="timeData">
                <van-button
                  size="small"
                  type="primary"
                  :text="!countDownStart ? '发送验证码' : timeData.seconds + 's后可重发'"
                  @click="sendSms"
                  :disabled="smsBtnDisabled"
                />
              </template>
            </van-count-down>
          </template>
        </van-field>
      </van-cell-group>
    </van-space>
    <van-button
      id="confirm-btn"
      type="primary"
      plain
      :loading="confirmLoading"
      loading-text="验证中..."
      @click="confirmBind"
    >
      确认绑定
    </van-button>
  </van-popup>
</template>

<script setup>
import isMobilePhone from 'validator/lib/isMobilePhone'
import { smsCheck, sendSmsCode } from '@/api/user.js'
const showPhoneBindPopup = ref(false)
const smsBtnDisabled = ref(false)
const confirmLoading = ref(false)
const props = defineProps({
  showPopup: {
    type: Boolean
  }
})
watch(
  () => props.showPopup,
  (newVal) => {
    showPhoneBindPopup.value = newVal
  }
)
const emits = defineEmits(['updateShowPopup', 'updatePhoneInfo'])
const closePopup = () => {
  emits('updateShowPopup', false)
}
const countDown = ref(null)
const time = ref(60 * 1000)
const countDownStart = ref(false)
const phoneNum = ref('')
const smsCode = ref('')
const phoneNumValidator = (phoneNum) => isMobilePhone(phoneNum, 'zh-CN')
const sendSms = async () => {
  if (!phoneNumValidator(phoneNum.value)) showFailToast('手机号格式有误')
  else {
    try {
      const res = await sendSmsCode({
        phone: phoneNum.value
      })
      if (res.code == status_code.OK) {
        smsBtnDisabled.value = true
        showSuccessToast(res.msg)
        // 开始倒计时
        countDownStart.value = true
        countDown.value.start()
      }
    } catch (error) {
      console.log(error)
    }
  }
}
const onCountDownFinish = () => {
  smsBtnDisabled.value = false
  countDownStart.value = false
  countDown.value.reset()
}
const confirmBind = async () => {
  if (!phoneNumValidator(phoneNum.value)) showFailToast('手机号格式有误')
  else if (smsCode.value == '') showFailToast('验证码不能为空')
  else {
    confirmLoading.value = true
    try {
      const res = await smsCheck({
        phone: phoneNum.value,
        sms: smsCode.value
      })
      console.log(res)
      if (res.code == status_code.OK) {
        showSuccessToast(res.msg)
        emits('updatePhoneInfo', res.data.phoneNum)
        closePopup()
      }
    } catch (error) {
      console.log(error)
    }
    confirmLoading.value = false
  }
}
</script>

<style scoped>
.phone-bind-popup {
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
:deep().van-field__label {
  display: flex;
  align-items: center;
  width: 45px;
}
</style>
