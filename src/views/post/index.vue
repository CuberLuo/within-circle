<template>
  <div>
    <van-cell-group inset>
      <van-field
        v-model="message"
        rows="3"
        autosize
        type="textarea"
        maxlength="300"
        placeholder="这一刻你想分享些什么?"
        show-word-limit
      />
    </van-cell-group>
  </div>
</template>

<script setup>
const message = ref('')
</script>

<style scoped></style>
