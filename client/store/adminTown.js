export const state = () => ({
    login: null,
    password: null,
    status: null,
    routes: [],
    users: [],
    lastHandshake: 0,
});

export const getters = {
    isTownQuestAuthOk: state => state.status === 'OK',

    getRoutes: state => state.routes || [],

    getUsers: state => state.users,

    getCommandName: state => state.login,

    pointIsComplete: state => (point, route) => state.complete.includes(index),

    pointIsFailed: state => (point, route) => state.failed.includes(index),

    lastHandshakeIsNotValid: state => +new Date() - state.lastHandshake > 10000,
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

    pushPoint(state, point) {
        state.points[state.points.length] = point;
    },

    pushCompletePoint(state, index) {
        state.complete.push(index);
    },

    pushFailPoint(state, index) {
        state.failed.push(index);
    },

    updateLastHandshake(state) {
        state.lastHandshake = +new Date();
    }
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

    async startPollingPoints(context) {
        const request = await this.$axios.get('/town/subscribe', { validateStatus: () => true }).catch(e => e);

        if ('data' in request) {
            if (request.data.status === 'error') {
                context.commit('pushFailPoint', context.state.points.length - 1);
            } else if (request.data.status === 'OK') {
                context.commit('pushCompletePoint', context.state.points.length - 1);
            }

            if (Object.keys(request.data.point).length === 0) return;
            context.commit('pushPoint', request.data.point);
        }

        await context.dispatch('startPollingPoints');
    }
};