const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	const options = {
		target: 'http://nestjs.yggdrasil:80',
		changeOrigin: true
	}
	app.use(createProxyMiddleware('/api', options));
};
