import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["swiper"],
  },
  server: {
    host: "0.0.0.0", // Chạy trên tất cả các địa chỉ IP
    port: 5173, // Port của dev server
    allowedHosts: [
      "elavia.tahoanghiep.com", // Thêm domain của bạn vào đây
    ],
    hmr: {
      protocol: "wss", // Dùng wss cho HTTPS
      host: "elavia.tahoanghiep.com", // Sử dụng domain thật của bạn
      port: 443, // Port 443 cho HTTPS
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["elavia.tahoanghiep.com"],
  },
});
