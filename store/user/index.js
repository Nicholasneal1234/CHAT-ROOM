export const state = () => ({
  userInfo: {
    name: '',
    userId: 0,
  },
});

export const getters = {
  getUserInfo(state) {
    return state.userInfo;
  },
};

export const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
};

export const actions = {
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo);
  },
};