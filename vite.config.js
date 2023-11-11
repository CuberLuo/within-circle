import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/vite'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
          vant: ['showSuccessToast', 'showFailToast ']
        }
      ],
      eslintrc: {
        enabled: true
      }
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
  }
})
