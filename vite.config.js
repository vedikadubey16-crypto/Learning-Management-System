import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      "/ml-api": {
        target:
          "https://learning-management-system-1ej4.onrender.com",

        changeOrigin: true,

        secure: true,

        rewrite: (path) =>
          path.replace(
            /^\/ml-api/,
            "",
          ),
      },
    },
  },
});