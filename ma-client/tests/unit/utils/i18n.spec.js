import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';

import { generateTitle } from '@/common/utils/i18n';
const localVue = createLocalVue();
localVue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'en_US',
    messages: {
        en_US: {
            route: {
                'dashboad': 'Dashboard'
            }
        },
        zh_CN: {
            route: {
                'dashboad': '首页'
            }
        }
    }
});

const Component = {
    template: `
      <div>
        <span id="title1">{{ generateTitle('test') }}</span>
        <span id="title2">{{ generateTitle('dashboad') }}</span>
      </div>
    `,
    methods: {
        generateTitle
    }
};

describe('i18n.js', () => {
    const wrapper = shallowMount(Component, {
        localVue,
        i18n
    });

    // console.log('-------', wrapper.vm.$te('route.dashbord'));
    // console.log('====', wrapper.vm.locale);
    // console.log('++++', wrapper.vm.$te('dashboard.welcome'));

    it('generate miss title', () => {
        const el = wrapper.find('#title1');
        expect(el.text()).toBe('test');
    });

    it('generate exist title', () => {
        const el = wrapper.find('#title2');
        expect(el.text()).toBe('Dashboard');
    });

    it('generate exist title, checke language', () => {
        i18n.locale = 'zh_CN';
        const el = wrapper.find('#title2');

        expect(el.text()).toBe('首页');
    });
});

