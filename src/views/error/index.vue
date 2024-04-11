<template>
  <div class="err">
    <van-empty image="error">
      <template #description>
        <div>请在方圆几里App中打开本站点</div>
      </template>
    </van-empty>
  </div>
</template>

<script setup></script>

<style scoped>
.err {
  height: 100vh;
  display: flex;
  justify-content: center;
  text-shadow:
    0 0 10px #4facfe,
    0 0 20px #4facfe,
    0 0 30px #4facfe,
    0 0 40px #4facfe;
}
:deep().van-empty__description {
  padding: 0;
  color: #ffffff;
  font-size: 25px;
}
</style>
