const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Herbert says hello!";
      return args;
    });
    config.resolve.alias.set("@", path.resolve(__dirname, "src/client"));
  }
};
