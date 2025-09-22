import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import pkg from './package.json';

export default defineConfig(() => {
  const rootDir = process.env.NODE_ENV === 'development' ? 'playground' : '.';
  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version)
    },
    root: path.resolve(__dirname, rootDir),
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'agentCreate',
        fileName: format => `index.${format}.js`,
        formats: ['es'],
      },
      sourcemap: false,        // 关掉 map
      minify: 'terser',        // 压缩 + 混淆
      rollupOptions: {
        output: {
          dir: 'dist',
        },
        external: ['fs', 'fs/promises', 'path']
      },
    },
    plugins: [dts()],
  }
});
