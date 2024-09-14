
// import { asyncRoutes, constantRoutes } from '../../router';
jest.mock('@/pages/main/router', () => ({
    asyncRoutes: [
        {
            path: '/testRoute',
            meta: {
                title: 'testRoute',
                permission: 'TestRoute'
            }
        }
    ],
    constantRoutes: []
}));
import store from '@/common/store';
import appStore from '@/pages/main/store';

Object.keys(appStore).forEach(key => {
    store.registerModule(key, appStore[key]);
});

describe('Permission store', () => {
    it('set router', () => {
        const router = {
            path: '/',
            redirect: '/dashboard'
        };

        store.commit('permission/SET_ROUTES', router);
        const routers = store.getters['permission/routes'];
        expect(routers.pop()).toEqual(router);
    });

    it('get router', async() => {
        window.accessMap = {
            TestRoute: [1]
        };

        const accessRoutes = await store.dispatch('permission/generateRoutes', [1]);

        expect(accessRoutes).toEqual([{
            path: '/testRoute',
            meta: {
                title: 'testRoute',
                permission: 'TestRoute'
            }
        }]);
    });
});
