export default ({$axios}) => {
	$axios.onRequest(config => {
		console.log('Making request to ' + config.url)
	})

	$axios.setBaseURL('https://api.brony-quest.ru');
	if (localStorage.name) $axios.setToken(btoa(unescape(encodeURIComponent(localStorage.name + ':' + localStorage.hash))), 'Basic');
}
