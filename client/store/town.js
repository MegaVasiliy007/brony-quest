export const state = () => ({
  login: null,
  password: null,
  status: null,
  all: null,
  complete: null,
  failed: null,
  points: null,
});

export const getters = {
  isTownQuestAuthOk: state => state.status === 'OK',

  getPoints: state => state.points,

  getAllCount: state => state.all,

  getCommandName: state => state.login,

  pointIsComplete: state => index => state.complete.includes(index),

  pointIsFailed: state => index => state.failed.includes(index),
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
    state.all = data.all;
    state.complete = data.complete;
    state.failed = data.failed;

    state.points = data.points;
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
};

export const actions = {
  async doAuth(context, { login, password }) {
    context.commit('auth', { // Авторизация
      login: login,
      password: password,
    });

    const data = await this.$axios.$get('/town/init');
    context.commit('setData', data);
  },

  async postAnswer(context, answer) {
    const data = await this.$axios.$post('/town/check', {answer});
    return data.status;
  },

  async startPollingPoints(context) {
    const data = await this.$axios.$get('/town/subscribe').catch(() => null);

    if (data?.status === 'OK') {
      context.commit('pushCompletePoint', context.state.points.length - 1);
      context.commit('pushPoint', data.point);
    } else if (data?.status === 'error') {
      context.commit('pushFailPoint', context.state.points.length - 1);
      context.commit('pushPoint', data.point);
    }

    await context.dispatch('startPollingPoints');
  }
};