import { hasPermission } from '@/common/utils';

export default {
    inserted(el, binding) {
        const { value } = binding;
        if (!hasPermission(value)) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
};
