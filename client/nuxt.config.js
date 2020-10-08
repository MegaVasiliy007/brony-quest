export default {
	ssr: false,
	build: {
		extractCSS: {
			ignoreOrder: true
		}
	},
	modules: [
		'@nuxtjs/axios'
	],
	buildModules: [
		'@aceforth/nuxt-optimized-images',
	],
	optimizedImages: {
		handleImages: ['jpg', 'jpeg', 'png'],
		optimizeImages: true,
		optimizeImagesInDev: false,
		defaultImageLoader: 'img-loader',
		mozjpeg: {
			progressive: true,
			quality: 75,
		},
		optipng: {
			optimizationLevel: 4,
		},
		pngquant: {
			quality: [0.50, 0.70],
			speed: 8
		},
	},
	plugins: [
		'~/plugins/axios',
		'~/plugins/vue-js-modal'
	]
};
