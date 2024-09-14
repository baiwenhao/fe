import avatarImg from '@/assets/common/default_user_avatar.svg';
const state = {
    name: '',
    avatar: '',
    permissions: undefined,
    routerIsReset: false // if need reset router
};

const mutations = {
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_PERMISSIONS: (state, permissons) => {
        state.permissions = permissons;
    },
    SET_ROUTER_STATUS: (state, routerIsReset) => {
        state.routerIsReset = routerIsReset;
    }
};

const actions = {
    // get user info
    getInfo({ commit }) {
        const maUserName = window.maUserName || '';
        const data = {
            name: maUserName,
            permissions: window.permissions || [],
            roles: ['admin']
        };
        const { name, permissions, avatar } = data;

        commit('SET_NAME', name || 'Anonymous User');
        commit('SET_AVATAR', avatar || avatarImg);
        commit('SET_PERMISSIONS', permissions);
        return data;
    },

    // user logout
    logout({ commit }) {
        return new Promise(async(resolve, reject) => {
            try {
                commit('SET_ROUTER_STATUS', true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_PERMISSIONS', []);
            resolve();
        });
    },

    // reset routerStatus
    resetRouterStatus({ commit }, status) {
        commit('SET_ROUTER_STATUS', status);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};

