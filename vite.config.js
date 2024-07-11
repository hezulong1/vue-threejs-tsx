import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    base: '/vue-threejs-tsx/',
    plugins: [
      vueJsx(),
    ],
    build: {
      minify: false,
      rollupOptions: {
        external: [
          'vue',
          'three',
          /^three\/addons\/*/
        ],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        }
      }
    },
    optimizeDeps: {
      include: [
        '@vueuse/core',
      ],
    },
  }
});
