import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("./src/shared/", import.meta.url)),
      "@client": fileURLToPath(new URL("./src/client/", import.meta.url)),
    },
  },
});
