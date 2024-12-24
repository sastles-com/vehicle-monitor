// next.config.js
module.exports = {
  webpackDevMiddleware: (config) => {
    config.devServer = {
      ...config.devServer,
      port: 8080, // ポート番号を変更できます
    };
    return config;
  },
};