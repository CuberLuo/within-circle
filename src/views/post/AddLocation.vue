<template>
  <div>
    <van-cell title="添加地点" is-link icon="location-o" @click="show = true">
      <template #value>
        <van-text-ellipsis :content="cellValue" />
      </template>
    </van-cell>
    <van-action-sheet v-model:show="show" title="添加地点">
      <div class="content">
        <div>
          <span>当前地点:{{ cellValue }}</span>
        </div>
        <form action="/">
          <van-search
            id="placeInput"
            v-model="searchValue"
            placeholder="请输入地点关键词"
            @search="onSearch"
            @update:model-value="onSearch"
          />
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

let userCity = ''
onMounted(() => {
  AMapLoader.load({
    key: amap.key,
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.Geocoder']
  }).then((AMap) => {
    const geolocation = new AMap.Geolocation({
      useNative: true,
      timeout: 10 * 1000,
      enableHighAccuracy: true //使用高精度定位
    })
    geolocation.getCurrentPosition(function (status, result) {
      if (status == 'complete') {
        console.log('定位成功', result)
        const { lat, lng } = result.position
        //获取经纬度逆地理编码为详细地址
        const geocoder = new AMap.Geocoder()
        const lnglat = [lng, lat]
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            console.log('地理位置信息:', result)
            cellValue.value = result.regeocode.formattedAddress
            onClickCell(cellValue.value, lng, lat)
            userCity = result.regeocode.addressComponent.city
            console.log(userCity)
          }
        })
      } else {
        console.log('定位失败', result)
        showFailToast('无法获取当前定位')
      }
    })
  })
})

const show = ref(false)
const cellValue = ref('')
const searchValue = ref('')
const poiList = ref([])

const onSearch = (val) => {
  if (val == '') return
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
    const keywords = val
    const placeSearch = new AMap.PlaceSearch({
      city: userCity
    })

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
