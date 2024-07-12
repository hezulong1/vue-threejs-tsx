import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    base: isDev ? '/' : '/vue-threejs-tsx/',
    plugins: [
      vueJsx(),
    ],
    build: {
      minify: true,
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
