export const state = () => ({
	name: null,
	hash: null,
	townQuest: {
		login: null,
		password: null,
		init: {},
	}
});

export const getters = {
	isAuth(state) {
		return !!state.name;
	},

	getName(state) {
		return state.name;
	},

	isTownQuestAuthOk(state) {
		return state.townQuest.init?.status === 'OK';
	}
}

export const mutations = {
	auth(state, { username, hash }) {
		state.name = username;
		state.hash = hash;

		localStorage.name = state.name;
		localStorage.hash = state.hash;

		this.$axios.setToken(
			btoa(unescape(encodeURIComponent(state.name + ':' + state.hash))),
			'Basic'
		);
	},

	async townAuth(state, { login, password }) {
		state.townQuest.login = login;
		state.townQuest.password = password;

		localStorage.login = state.townQuest.login;
		localStorage.password = state.townQuest.password;

		this.$axios.setToken(
			btoa(unescape(encodeURIComponent(state.townQuest.login + ':' + state.townQuest.password))),
			'Basic',
		);

		const init = await this.$axios.$get('/town/init');
		console.log(init);
		state.townQuest.init = init;
	}
};

export const actions = {};