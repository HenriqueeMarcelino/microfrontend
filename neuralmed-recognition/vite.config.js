import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "recognition",
      filename: "remoteEntry.js",
      exposes: {
        "./Recognition": "./src/main.js", // 🔹 Agora expõe `main.js` ao invés de `App.vue`
      },
      shared: ["vue", "element-plus"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    modulePreload: false,
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  }
});
