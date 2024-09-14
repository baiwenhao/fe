import { asyncRoutes, constantRoutes } from '../../router';
import { and } from '@ma-dev/auth-utils';

/**
 * Use meta.role to determine if the current user has permission
 * @param { Object } permissions permissions to route
 * @param { Object } route router
 * @returns { Boolean } result
 */
function hasPermission(permissions, route) {
    if (route.meta && route.meta.permission) {
        const accessMap = window.accessMap || {};
        return and(permissions, accessMap[route.meta.permission] || 0);
    }
    return true;
}

/**
 * Filter asynchronous routing tables by recursion
 * @param { Array } routes asyncRoutes
 * @param { Array } roles roles for judge
 * @returns { Array } res
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];

    routes.forEach(route => {
        const tmp = { ...route };
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            if (!tmp.children || (tmp.children && tmp.children.length > 0)) {
                res.push(tmp);
            }
        }
    });

    return res;
}

const state = {
    routes: [],
    addRoutes: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = constantRoutes.concat(routes);
    }
};

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes);
        });
    }
};

const getters = {
    routes: state => state.routes
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
