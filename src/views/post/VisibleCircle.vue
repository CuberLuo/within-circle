<template>
  <div>
    <van-cell title="方圆几里可见" is-link icon="circle" :value="cellValue" @click="show = true" />
    <van-action-sheet v-model:show="show" title="方圆几里可见" @close="onCloseSheet">
      <div class="content">
        <van-slider v-model="sliderValue" step="10">
          <template #button>
            <div class="custom-button">{{ distanceValue }}</div>
          </template>
        </van-slider>
        <div id="distance_tips">
          <span class="tips_span" v-if="sliderValue == 0">仅自己可见</span>
          <span class="tips_span" v-else-if="sliderValue != 100">
            {{ distanceValue }}={{ sliderValue * 50 }}米
          </span>
          <span class="tips_span" v-else>可见性不受距离约束</span>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
const show = ref(false)
const sliderValue = ref(20)
const distanceValue = ref('2里') //默认方圆2里可见
const cellValue = ref('')
watch(sliderValue, (newVal) => {
  if (newVal == 100) distanceValue.value = '无限制'
  else if (newVal == 0) distanceValue.value = '不可见'
  else distanceValue.value = `${newVal / 10}里`
})
const emits = defineEmits(['updateVisibleCircle'])
const onCloseSheet = () => {
  cellValue.value = distanceValue.value
  emits('updateVisibleCircle', sliderValue.value / 10)
}
</script>

<style scoped>
.content {
  padding: 16px 16px 80px;
  margin: 12px;
}
.custom-button {
  width: 35px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: var(--van-primary-color);
  border-radius: 100px;
}

#distance_tips {
  display: flex;
  justify-content: center;
}
.tips_span {
  margin-top: 50px;
  font-size: 20px;
  color: gray;
}
</style>
