<template>
  <div class="authDiv">
    <header class="authHeader">
      <NavBar />
    </header>

    <van-form class="authForm" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="phoneNum"
          name="phone"
          label="手机号(+86)"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '手机号不能为空' },
            { validator: phoneNumValidator, message: '手机号格式有误' }
          ]"
          maxlength="11"
        />
        <van-field
          v-model="smsCode"
          name="sms"
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
          :rules="[{ required: true, message: '验证码不能为空' }]"
          maxlength="5"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :text="smsBtnText"
              :disabled="smsBtnDisabled"
              @click="sendSms"
            />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          :loading="submitLoading"
          type="primary"
          native-type="submit"
          class="submit-button"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import NavBar from '@/layout/components/NavBar.vue'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { sendSmsCode, checkSmsCode } from '@/api/user'
import { useUserTokenStore } from '@/stores/userToken.js'

const phoneNum = ref('')
const smsCode = ref('')
const submitLoading = ref(false)
const smsBtnDisabled = ref(true)
const smsBtnText = ref('发送验证码')
const smsLeftTime = ref(0)
const resendTime = 60 //重新发送验证码的时间
let smsTimerId = null

const phoneNumValidator = (phoneNum) => isMobilePhone(phoneNum, 'zh-CN')
const sendSms = () => {
  smsBtnDisabled.value = true
  sendSmsCode(phoneNum.value)
  showSuccessToast('验证码已发送')
  updateSmsBtnText(resendTime)
  smsTimerId = setInterval(() => {
    updateSmsBtnText(--smsLeftTime.value)
  }, 1000)
}
const updateSmsBtnText = (leftTime) => {
  if (leftTime > 0) {
    smsLeftTime.value = leftTime
    smsBtnText.value = `${leftTime}s后可重发`
  } else {
    smsBtnText.value = '发送验证码'
    smsBtnDisabled.value = false
    clearInterval(smsTimerId) //停止倒计时
  }
}

watch(phoneNum, (newVal) => {
  if (smsLeftTime.value == 0) smsBtnDisabled.value = !isMobilePhone(newVal, 'zh-CN')
})

const onSubmit = (val) => {
  submitLoading.value = true
  console.log(val)
  checkSmsCode(val).then((res) => {
    submitLoading.value = false
    if (res.code == 10000) {
      showSuccessToast(res.msg)
      useUserTokenStore().setToken(res.data.access_token)
      router.push('/')
    } else showFailToast(res.msg)
  })
}
</script>

<style scoped>
.authDiv {
  display: flex;
  height: 100vh;
  align-items: center;
}

.authHeader {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
