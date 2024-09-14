import { createLocalVue } from '@vue/test-utils';
import ElementUI from 'element-ui';

import store from '@/common/store';
import appStore from '@/pages/main/store';

Object.keys(appStore).forEach(key => {
    store.registerModule(key, appStore[key]);
});

const localVue = createLocalVue();
localVue.use(ElementUI);

describe('User store', () => {
    it('set name', () => {
        store.commit('user/SET_NAME', 'TEST');
        expect(store.getters.name).toBe('TEST');
    });

    it('set permission', () => {
        store.commit('user/SET_PERMISSIONS', [1]);
        expect(store.getters.permissions).toEqual([1]);
    });

    it('get default user info', async() => {
        await store.dispatch('user/getInfo');
        expect(store.getters.name).toBe('Anonymous User');
    });

    it('get user info', async() => {
        window.maUserName = 'TEST';
        await store.dispatch('user/getInfo');
        expect(store.getters.name).toBe('TEST');
    });
});
