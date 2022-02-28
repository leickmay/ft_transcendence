const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware(
	  '/users',
	  {
        target: 'http://nestjs.yggdrasil:3080',
        changeOrigin: true
	})
  );
};
