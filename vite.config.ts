import { defineConfig, splitVendorChunkPlugin } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin(), splitVendorChunkPlugin()],
  build: {
    target: 'esnext',
    outDir: 'docs',
    minify: 'terser',
    polyfillDynamicImport: false,
  },
});
