<template>
  <van-grid class="emoji-grid" square clickable :border="false" column-num="4">
    <van-grid-item v-for="(emoji, index) in emojiList" :key="index">
      <span class="emoji" @click="getEmo(index)">{{ emoji }}</span>
    </van-grid-item>
  </van-grid>
</template>

<script setup>
import emojiList from '@/components/data/emoji.json'
const emits = defineEmits(['clickedEmoji'])
const getEmo = (index) => {
  emits('clickedEmoji', emojiList[index])
}
</script>

<style scoped>
.emoji-grid {
  width: 200px;
  height: 200px;
  overflow: scroll;
}
.emoji {
  font-size: 20px;
}
</style>
