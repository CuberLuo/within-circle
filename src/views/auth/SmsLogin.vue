<template>
  <div class="authDiv">
    <van-form class="authForm" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="phoneNum"
          name="phone"
          label="手机号(+86)"
          type="tel"
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
          type="number"
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
import isMobilePhone from 'validator/lib/isMobilePhone'
import { sendSmsCode, smsCheck } from '@/api/user'
import { useUserTokenStore } from '@/stores/userToken.js'
import { getUserInfo } from '@/api/userinfo'
import { useUserInfoStore } from '@/stores/userInfo.js'

const phoneNum = ref('')
const smsCode = ref('')
const submitLoading = ref(false)
const smsBtnDisabled = ref(true)
const smsBtnText = ref('发送验证码')
const smsLeftTime = ref(0)
const resendTime = 60 //重新发送验证码的时间
let smsTimerId = null

const phoneNumValidator = (phoneNum) => isMobilePhone(phoneNum, 'zh-CN')
const sendSms = async () => {
  try {
    const res = await sendSmsCode({
      phone: phoneNum.value,
      sms_flag: 'login'
    })
    if (res.code == status_code.OK) {
      smsBtnDisabled.value = true
      showSuccessToast(res.msg)
      updateSmsBtnText(resendTime)
      smsTimerId = setInterval(() => {
        updateSmsBtnText(--smsLeftTime.value)
      }, 1000)
    }
  } catch (error) {
    console.log(error)
  }
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

const onSubmit = async (val) => {
  submitLoading.value = true

  try {
    val.sms_flag = 'login'
    const res = await smsCheck(val)
    if (res.code == status_code.OK) {
      showSuccessToast(res.msg)
      const { access_token, refresh_token } = res.data
      useUserTokenStore().setToken(access_token, refresh_token)
      getUserSelfInfo()
      router.push('/')
    }
  } catch (err) {
    console.log(err)
  }
  submitLoading.value = false
}

const getUserSelfInfo = async () => {
  try {
    const res = await getUserInfo()
    const { data } = res
    useUserInfoStore().setUserInfo({
      userId: data.user_id,
      userName: data.username,
      userAvatarUrl: data.avatar_url
    })
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
:deep().van-field__label {
  display: flex;
  align-items: center;
}
</style>
