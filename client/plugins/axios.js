export default ({$axios}) => {
	$axios.onRequest(config => {
		console.log('Making request to ' + config.url)
	})

	$axios.setBaseURL('http://95.174.110.154:8080');
	if (localStorage.name) $axios.setToken(btoa(localStorage.name + ':' + localStorage.hash), 'Basic');
}
