module.exports = {
	lintOnSave: false,
	devServer: {
		host: "localhost",
		port: 8080,
		https: false,
		open: true,
		proxy: {
			'/admin': {
				target: 'http://xeshi.icu/admin',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/admin': ''
				}
			}
		}
	}
}
