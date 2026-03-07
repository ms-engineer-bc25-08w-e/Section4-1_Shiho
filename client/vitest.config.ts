import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // ブラウザ環境をシミュレート
    globals: true, // expect などの関数をグローバルで使えるようにする
  },
});
