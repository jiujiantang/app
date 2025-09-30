import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/assists/js/popup.ts'),      // popup脚本
                background: resolve(__dirname, 'src/assists/js/background.ts'), // 后台脚本
                content: resolve(__dirname, 'src/assists/js/content.ts'),       // 窗口、文档脚本
            },
            output: {
                entryFileNames: (chunk) => {
                    if (['popup','background', 'content'].includes(chunk.name)) {
                        return `${chunk.name}.js`
                    }else {
                        return `assets/[name].[hash].js`
                    }
                },
                chunkFileNames: '[name].[hash].js',
                assetFileNames: '[name].[ext]'
            }
        }
    },
    plugins: [
        // 自动拷贝 manifest.json 和 icons 到 dist
        viteStaticCopy({
            targets: [
                { src: 'src/manifest.json', dest: '.' },
                { src: 'src/icons', dest: '.' },
                { src: 'src/popup.css', dest: '.' },
                { src: 'popup.html', dest: '.' },
            ]
        })
    ]
})
