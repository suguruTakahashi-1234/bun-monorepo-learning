import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      external: [
        /.*\.test\.(ts|tsx|js|jsx)$/,
        /.*\.spec\.(ts|tsx|js|jsx)$/,
        /__tests__/,
      ],
    },
  },
});
