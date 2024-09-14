import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import i18n from '@/lang';
import store from '@/common/store';
import appStore from '@/pages/main/store';

Object.keys(appStore).forEach(key => {
    store.registerModule(key, appStore[key]);
});

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(ElementUI);

const routes = [
    {
        path: '/',
        name: 'home',
        children: [{
            path: 'dashboard',
            name: 'dashboard'
        }]
    },
    {
        path: '/menu',
        name: 'menu',
        meta: { title: 'menu' },
        children: [{
            path: '/menu/menu1',
            name: 'menu1',
            meta: { title: 'menu1' },
            children: [{
                path: '/menu/menu1/menu1-1',
                name: 'menu1-1',
                meta: { title: 'menu1-1' }
            },
            {
                path: '/menu/menu1/menu1-2',
                name: 'menu1-2',
                redirect: 'noredirect',
                meta: { title: 'menu1-2' },
                children: [{
                    path: '/menu/menu1/menu1-2/menu1-2-1',
                    name: 'menu1-2-1',
                    meta: { title: 'menu1-2-1' }
                },
                {
                    path: '/menu/menu1/menu1-2/menu1-2-2',
                    name: 'menu1-2-2'
                }]
            }]
        }]
    }];

const router = new VueRouter({
    routes
});

store.commit('permission/SET_MENUS', routes);

describe('Breadcrumb.vue', () => {
    const wrapper = mount(Breadcrumb, {
        localVue,
        router,
        i18n,
        store
    });
    it('dashboard', () => {
        router.push('/dashboard');
        const len = wrapper.findAll('.el-breadcrumb__inner').length;
        expect(len).toBe(1);
    });
    it('normal route', () => {
        router.push('/menu/menu1');
        const len = wrapper.findAll('.el-breadcrumb__inner').length;
        expect(len).toBe(3);
    });
    it('nested route', () => {
        router.push('/menu/menu1/menu1-2/menu1-2-1');
        const len = wrapper.findAll('.el-breadcrumb__inner').length;
        expect(len).toBe(5);
    });
    it('click link', () => {
        router.push('/menu/menu1/menu1-2/menu1-2-1');
        const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner');

        const second = breadcrumbArray.at(1);
        const tag = second.find('a');
        expect(tag.text()).toBe('menu');
    });
    // it('noRedirect', () => {
    //   router.push('/menu/menu1/menu1-2/menu1-2-1')
    //   const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
    //   const redirectBreadcrumb = breadcrumbArray.at(2)
    //   expect(redirectBreadcrumb.contains('a')).toBe(false)
    // })
    // it('last breadcrumb', () => {
    //     router.push('/menu/menu1/menu1-2/menu1-2-1');
    //     const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner');
    //     const redirectBreadcrumb = breadcrumbArray.at(3);
    //     expect(redirectBreadcrumb.contains('a')).toBe(false);
    // });
});

