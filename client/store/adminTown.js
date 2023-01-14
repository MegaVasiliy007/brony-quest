export const state = () => ({
    login: null,
    password: null,
    status: null,
    routes: [],
    users: [],
});

export const getters = {
    isTownQuestAuthOk: state => state.status === 'OK',

    getRoutes: state => state.routes || [],

    getUsers: state => state.users,

    getCommandName: state => state.login,

    pointIsComplete: state => (routeIndex, index) => state.users[routeIndex].complete.includes(index),

    pointIsFailed: state => (routeIndex, index) => state.users[routeIndex].failed.includes(index),

    pointTimestamp: state => (routeIndex, index) => state.users[routeIndex]?.timestamps[index] || -1,

    getWrongAnswers: state => (routeIndex, index) => state.users[routeIndex]?.answers[index] || [],
}

export const mutations = {
    async auth(state, { login, password }) {
        state.login = login;
        state.password = password;

        localStorage.login = state.login;
        localStorage.password = state.password;

        this.$axios.setToken(
            btoa(unescape(encodeURIComponent(state.login + ':' + state.password))),
            'Basic',
        );
    },

    setData(state, data) {
        state.status = data.status;

        state.routes = data.routes;
        state.users = data.users;
    },
};

export const actions = {
    async doAuth(context, { login, password }) {
        context.commit('auth', { // Авторизация
            login: login,
            password: password,
        });

        const data = await this.$axios.$get('/town/admin');
        context.commit('setData', data);
    },
};