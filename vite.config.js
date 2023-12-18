import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/vite'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import mkcert from 'vite-plugin-mkcert'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // basicSsl(),
    mkcert(),
    Components({
      resolvers: [VantResolver()]
    }),
    AutoImport({
      include: [
        /\.js$/, //.js
        /\.vue$/ //.vue
      ],
      imports: [
        'vue',
        'vue-router',
        {
          '@/utils/storage': ['setItem', 'getItem', 'removeItem', 'removeAllItem'],
          vant: [
            'showToast',
            'showSuccessToast',
            'showFailToast',
            'showLoadingToast',
            'closeToast',
            'showConfirmDialog',
            'showDialog'
          ],
          '@/router': [['default', 'router']]
        }
      ],
      eslintrc: {
        enabled: true
      }
    }),
    viteCompression({
      deleteOriginFile: true, //删除源文件
      algorithm: 'gzip', //压缩算法
      ext: '.gz', //文件类型
      threshold: 1024 // 对大于 1kb 的文件进行压缩
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 需要转换的单位，默认为"px"
          viewportWidth: 375 // 设计稿的视口宽度
        })
      ]
    }
  },
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1029',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
