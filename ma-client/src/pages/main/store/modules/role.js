const state = {
    role: '',
    user: ''
};

const mutations = {
    SET_ROLE: (state, role) => {
        state.role = role;
    },
    SET_USER: (state, user) => {
        state.user = user;
    }
};

const actions = {

}

export default {
    state,
    mutations,
    actions,
  };