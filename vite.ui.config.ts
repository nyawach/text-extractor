import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: './src',
  plugins: [reactRefresh(), viteSingleFile()],
  esbuild: {
    jsxFactory: 'jsx',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: false,
    target: 'es2015',
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 100_000_000,
    cssCodeSplit: false,
    brotliSize: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    watch: mode === 'production' ? null : {},
    sourcemap: mode === 'production' ? false : 'inline',
  },
}))
