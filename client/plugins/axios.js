export default ({$axios}) => {
	$axios.onRequest(config => {
		console.log('Making request to ' + config.url)
	})

	$axios.setBaseURL('http://127.0.0.1:8080');
	if (localStorage.name) $axios.setToken(btoa(unescape(encodeURIComponent(localStorage.name + ':' + localStorage.hash))), 'Basic');
}
