import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Main web API (player landing, rosters, etc.)
      "/nhl-api": {
        target: "https://api-web.nhle.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nhl-api/, ""),
      },
      // Stats REST API (player search)
      "/nhl-stats": {
        target: "https://api.nhle.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nhl-stats/, ""),
      },
    },
  },
});