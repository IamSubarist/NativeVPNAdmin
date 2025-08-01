import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // base: '/metronic/tailwind/react',
  base: "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000,
  },
    server: {
    proxy: {
<<<<<<< Updated upstream
      '/api': {
        target: 'http://vpnbot.sjp-asia.group/admin_panel/',
=======
      "/api": {
        target: "https://vpnbot.sjp-asia.group/admin_panel",
>>>>>>> Stashed changes
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
