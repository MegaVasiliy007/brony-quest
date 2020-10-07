export default {
	ssr: false,
	modules: [
		'@nuxtjs/axios'
	],
	plugins: [
		'~/plugins/axios',
		'~/plugins/vue-js-modal'
	]
};