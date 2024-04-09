const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭 错误弹窗
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
});
