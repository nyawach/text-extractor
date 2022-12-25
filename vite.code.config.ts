import path from 'path'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: './src',
  plugins: [tsconfigPaths(), viteSingleFile()],
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
    // NOTE: libの設定のみのビルドになる
    lib: {
      entry: path.resolve(__dirname, 'src/code/index.ts'),
      formats: ['es'],
      fileName: () => `code.js`,
    },
  },
}))
