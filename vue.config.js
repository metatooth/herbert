const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "dist/client"),
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/client")
      }
    }
  },

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Grow More";
      args[0].template = "src/client/public/index.html";
      args[0].favicon = "src/client/public/favicon.ico";
      return args;
    });
  }
};
