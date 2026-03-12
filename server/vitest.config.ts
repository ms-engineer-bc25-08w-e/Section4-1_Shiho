import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // expectやdescribeをグローバルで使う設定
    environment: "node", // バックエンドの設定
  },
});
