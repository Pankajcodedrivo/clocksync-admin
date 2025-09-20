import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   build: {
    // Increase chunk size warning limit if needed
    chunkSizeWarningLimit: 1000, // in kB
  }
  // server: {
  //   port: 4000,
  // },
});
