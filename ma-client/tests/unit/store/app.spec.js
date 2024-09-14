import { createLocalVue } from '@vue/test-utils';
import ElementUI from 'element-ui';

import store from '@/common/store';
import appStore from '@/pages/main/store';

Object.keys(appStore).forEach(key => {
    store.registerModule(key, appStore[key]);
});

const localVue = createLocalVue();
localVue.use(ElementUI);

describe('App store', () => {
    it('close sidebar', () => {
        store.commit('app/CLOSE_SIDEBAR');
        expect(store.getters['app/sidebar'].opened).toEqual(false);
    });
    it('close sidebar', () => {
        store.dispatch('app/closeSideBar', { withoutAnimation: false });
        expect(store.getters['app/sidebar'].opened).toEqual(false);
    });
});
