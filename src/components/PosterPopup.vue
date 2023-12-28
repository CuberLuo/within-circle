<template>
  <van-popup v-model:show="showPosterPopup" round class="poster-popup" @close="closePopup">
    <h3>{{ posterId }}</h3>
  </van-popup>
</template>

<script setup>
const props = defineProps({
  posterId: {
    type: Number
  },
  showPopup: {
    type: Boolean
  }
})
const showPosterPopup = ref(false)
watch(
  () => props.showPopup,
  (newVal) => {
    showPosterPopup.value = newVal
  }
)
const emits = defineEmits(['updateShowPopup'])
const closePopup = () => {
  emits('updateShowPopup', false)
}
</script>

<style scoped>
.point-popup {
  width: 80vw;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
