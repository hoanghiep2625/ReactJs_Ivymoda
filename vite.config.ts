import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["swiper"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["ivymoda.tahoanghiep.com"], // 👈 thêm dòng này
  },
});
