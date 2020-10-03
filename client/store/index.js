export const state = () => ({
	name: null,
	hash: null
});

export const getters = {
	isAuth(state) {
		return !!state.name;
	},
	getName(state) {
		return state.name;
	}
}

export const mutations = {
	auth(state, { username, hash }) {
		state.name = username;
		state.hash = hash;
		localStorage.name = state.name;
		localStorage.hash = state.hash;
	}
};

export const actions = {};