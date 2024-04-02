<template>
  <div>
    <van-cell title="选择内容标签" is-link icon="label-o" @click="showPicker = true">
      <template #value>
        <van-text-ellipsis :content="fieldValue" />
      </template>
    </van-cell>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        v-model="selectedValues"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup>
const columns = [
  { text: '社交分享', value: '0' },
  { text: '新闻发布', value: '1' },
  { text: '广告宣传', value: '2' }
]
const fieldValue = ref('社交分享')
const showPicker = ref(false)
const selectedValues = ref(['0'])

const emits = defineEmits(['updateTagSelector'])
const onConfirm = ({ selectedOptions }) => {
  showPicker.value = false
  fieldValue.value = selectedOptions[0].text
  emits('updateTagSelector', fieldValue.value)
}

onMounted(() => {
  emits('updateTagSelector', fieldValue.value)
})
</script>

<style scoped></style>
