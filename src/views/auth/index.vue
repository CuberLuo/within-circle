<template>
  <van-form @submit="onSubmit">
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
        v-model="sms"
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
</template>

<script setup>
import isMobilePhone from 'validator/lib/isMobilePhone'
import { showSuccessToast } from 'vant'
import { ref, watch } from 'vue'
const phoneNum = ref('')
const sms = ref('')
const submitLoading = ref(false)
const smsBtnDisabled = ref(true)
const smsBtnText = ref('发送验证码')
const smsLeftTime = ref(0)
const resendTime = 5
let smsTimerId = null

const phoneNumValidator = (phoneNum) => isMobilePhone(phoneNum, 'zh-CN')
const sendSms = () => {
  smsBtnDisabled.value = true
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

const onSubmit = () => {}
</script>

<style scoped></style>
