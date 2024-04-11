import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/vite'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'
// import basicSsl from '@vitejs/plugin-basic-ssl'
// import mkcert from 'vite-plugin-mkcert'
import viteCompression from 'vite-plugin-compression'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd())
  return {
    plugins: [
      vue(),
      // basicSsl(),
      // mkcert(),
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
              'showDialog',
              'showNotify'
            ],
            '@/router': [['default', 'router']],
            '@/components/data/status_code.json': [['default', 'status_code']],
            '@/components/EmptyError.vue': [['default', 'EmptyError']]
          }
        ],
        eslintrc: {
          enabled: true
        }
      }),
      viteCompression({
        deleteOriginFile: false, //不删除源文件,否则生产环境会报错
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
      // 自动打开浏览器
      open: true,
      https: {
        cert: fs.readFileSync('./ssl/cert.crt'),
        key: fs.readFileSync('./ssl/cert.key')
      },
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      host: '0.0.0.0'
    }
  }
})
