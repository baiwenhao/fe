import { createLocalVue, shallowMount } from '@vue/test-utils';
import { permission } from '@/common/utils/i18n';

jest.mock('@/common/store', () => ({
    getters: {
        permissions: [1]
    }
}));

const localVue = createLocalVue();

const Component = {
    template: `
      <div>
        <span id="test" :v-permission="key">test</span>
      </div>
    `,
    data() {
        return {
            key: 'test'
        };
    },
    directives: { permission }

};

describe('permission.js', () => {
    const wrapper = shallowMount(Component, {
        localVue
    });

    // console.log('-------', wrapper.vm.$te('route.dashbord'));
    // console.log('====', wrapper.vm.locale);
    // console.log('++++', wrapper.vm.$te('dashboard.welcome'));

    it('has permission show "test"', () => {
        window.accessMap = { 'test': [1] };
        const el = wrapper.find('#test');
        expect(el.text()).toBe('test');
    });
    it('has permission not "test"', () => {
        window.accessMap = { 'test': [8] };
        const el = wrapper.find('#test');
        expect(el).toEqual({});
    });
});

