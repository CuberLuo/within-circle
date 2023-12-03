<template>
  <div>
    <van-cell title="添加地点" is-link icon="location-o" @click="show = true">
      <template #value>
        <van-text-ellipsis :content="cellValue" />
      </template>
    </van-cell>
    <van-action-sheet v-model:show="show" title="添加地点">
      <div class="content">
        <form action="/">
          <van-search v-model="searchValue" placeholder="请输入地点关键词" @search="onSearch" />
        </form>
        <van-cell-group>
          <van-cell
            v-for="poi in poiList"
            :key="poi.id"
            :title="poi.name"
            :label="poi.address"
            @click="onClickCell(poi.name, poi.location.lng, poi.location.lat)"
            clickable
          />
        </van-cell-group>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import amap from '@/components/data/amap.json'
const show = ref(false)
const cellValue = ref('')
const searchValue = ref('')
const poiList = ref([])

const onSearch = (val) => {
  showLoadingToast({
    message: '搜索中...',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  AMapLoader.load({
    key: amap.key,
    version: '2.0',
    plugins: ['AMap.PlaceSearch']
  }).then((AMap) => {
    var keywords = val
    var placeSearch = new AMap.PlaceSearch()
    placeSearch.search(keywords, function (status, result) {
      console.log(status)
      if (status == 'complete') {
        console.log(result)
        const { pois } = result.poiList
        closeToast()
        if (pois.length == 0) showFailToast('请更换关键词检索')
        poiList.value = pois
      } else {
        showFailToast('无法进行检索')
      }
    })
  })
}
const emits = defineEmits(['updateLocation'])
const onClickCell = (name, lng, lat) => {
  show.value = false
  cellValue.value = name
  emits('updateLocation', [name, lng, lat])
}
</script>

<style scoped>
.content {
  padding: 16px 16px 80px;
  margin: 12px;
}
:deep() .van-cell__value {
  flex: 2;
}
</style>
