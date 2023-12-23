<template>
  <header class="registerHeader">
    <NavBar :showArrow="true" />
  </header>
  <div class="registerDiv">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
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
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import NavBar from '@/layout/components/NavBar.vue'
import { pwdRegister } from '@/api/user'
import { useUserTokenStore } from '@/stores/userToken.js'
const username = ref('')
const password = ref('')
const submitLoading = ref(false)
const onSubmit = async (val) => {
  submitLoading.value = true
  console.log(val)
  try {
    const res = await pwdRegister(val)
    if (res.code == status_code.OK) {
      showSuccessToast(res.msg)
      useUserTokenStore().setToken(res.data.access_token)
      router.push('/')
    } else showFailToast(res.msg)
  } catch (err) {
    console.log(err)
  }

  submitLoading.value = false
}
</script>

<style scoped>
.registerHeader {
  position: absolute;
  top: 0;
  width: 100%;
}
.registerDiv {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  align-items: stretch;
  justify-content: center;
  height: 100vh;
}
</style>
