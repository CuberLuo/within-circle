# within-circle

本项目是一个基于`vite + vue3.4`构建的移动端项目

## 环境变量配置

根目录下新建.env文件

```
VITE_APP_NAME = 'within-circle'
# 添加自己的高德地图Web端开发者Key
VITE_AMAP_KEY = XXX
VITE_APP_UA_FLAG = 'WithinCircle'
# 后端接口地址
VITE_APP_API_BASE_URL = XXX
```

## 项目涉及的关键技术点

- 本地SSL证书配置
- 双token无感刷新
- 复杂自定义组件的封装
- Vue自定义插件封装
- vant（UI组件库）
- 自定义深浅色模式下的CSS变量
- Pinia+LocalStorage数据持久化
- Axios二次封装
- postcss-px-to-viewport-8-plugin（移动端浏览器适配）
- vite-plugin-compression（打包构建gzip压缩）
- unplugin-auto-import（自动导包）
- 高德地图 JS API
- image-conversion（用于文件压缩）
- socket-io（即时通讯）
- vue3-touch-events（触摸事件库）
- arale-qrcode（二维码生成）
- vue-qrcode-reader（二维码扫描）
- vueuse（组合式API库）
- ...
