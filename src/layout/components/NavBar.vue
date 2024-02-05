<template>
  <van-nav-bar
    :title="navBarTitle"
    :left-arrow="showArrow"
    :left-text="leftText"
    @click-left="onClickLeft"
  />
</template>

<script setup>
const route = useRoute()
const navBarTitle = ref(route.meta.title)
watch(route, (newRoute) => {
  navBarTitle.value = newRoute.meta.title
})
const leftText = ref('')

const props = defineProps({
  showArrow: Boolean
})
if (props.showArrow) leftText.value = '返回'
const onClickLeft = () => {
  history.go(-1)
}
</script>

<style scoped></style>
