import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 8080,
  },
  plugins: [vue(), vueDevTools()],
  base: "/ayanokouji-kiyotaka/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "static/js/[name].js", // 自定义入口文件名
        chunkFileNames: "static/js/[name].js", // 自定义 chunk 文件名
        assetFileNames: "static/[ext]/[name].[ext]", // 静态资源文件名
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
});
