import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["swiper"], // Đảm bảo rằng Swiper được tối ưu hóa
  },
  server: {
    host: "0.0.0.0", // Listen trên tất cả interfaces
    port: 5173, // Đảm bảo cổng là 5173
  },
});
