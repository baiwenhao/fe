import { shallowMount, createLocalVue } from '@vue/test-utils';
import ElementUI from 'element-ui';

import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

const localVue = createLocalVue();
localVue.use(ElementUI);

describe('Breadcrumb.vue', () => {
    const wrapper = shallowMount(Pagination, {
        localVue,
        propsData: {
            total: 100
        }
    });
    it('should show component', () => {
        const len = wrapper.findAll('.m-pagination').length;
        expect(len).toBe(1);
    });
    it('should not show component', () => {
        wrapper.setProps({ hidden: true });
        const len = wrapper.findAll('.m-pagination_hidden').length;
        expect(len).toBe(1);
    });
});

