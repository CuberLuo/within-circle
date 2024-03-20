<template>
  <div class="authDiv">
    <van-form class="authForm" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '用户名不能为空' }]"
          maxlength="11"
        />
        <van-field
          v-model="password"
          name="password"
          clearable
          type="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '密码不能为空' }]"
          maxlength="15"
        />
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
import { pwdLogin } from '@/api/user'
import { useUserTokenStore } from '@/stores/userToken.js'
import { useUserInfo } from './userInfo'

const username = ref('')
const password = ref('')
const submitLoading = ref(false)
const onSubmit = async (val) => {
  submitLoading.value = true
  console.log(val)
  try {
    const res = await pwdLogin(val)
    if (res.code == status_code.OK) {
      showSuccessToast(res.msg)
      const { access_token, refresh_token } = res.data
      useUserTokenStore().setToken(access_token, refresh_token)

      useUserInfo()
      router.push('/')
    }
  } catch (err) {
    console.log(err)
  }

  submitLoading.value = false
}
</script>

<style scoped></style>
