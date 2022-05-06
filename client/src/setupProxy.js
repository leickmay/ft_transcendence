const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://nestjs.yggdrasil:80',
			changeOrigin: true,
		})
	);
};
