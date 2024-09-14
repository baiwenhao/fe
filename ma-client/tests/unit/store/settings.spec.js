import { createLocalVue } from '@vue/test-utils';
import ElementUI from 'element-ui';

import store from '@/common/store';
import appStore from '@/pages/main/store';

Object.keys(appStore).forEach(key => {
    store.registerModule(key, appStore[key]);
});

const localVue = createLocalVue();
localVue.use(ElementUI);

describe('Setting store', () => {
    it('init setting ', () => {
        expect(store.state.settings.fixedHeader).toEqual(true);
    });
});
