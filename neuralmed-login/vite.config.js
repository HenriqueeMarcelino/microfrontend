import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    svelte(),
    federation({
      name: "login",
      filename: "remoteEntry.js",
      remotes: {
        recognition: "http://localhost:3000/assets/remoteEntry.js",
      },
      exposes: {
        "./Login": "./src/App.svelte",
      },
      shared: [],
    }),
  ],
  build: {
    target: "esnext",
  },
});
