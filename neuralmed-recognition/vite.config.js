import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'recognition',
      filename: 'remoteEntry.js',
      exposes: {
        "./Recognition": "./src/main.js", // 🔹 Agora expõe `main.js` ao invés de `App.vue`
      },
      shared: ["vue", "element-plus"],
    }),
  ],
  publicDir: 'public',
  build: {
    target: "esnext",
    minify: false,
    modulePreload: false,
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.onnx')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  },
  assetsInclude: ['**/*.wasm']
});