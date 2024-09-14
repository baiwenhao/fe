import router from './router';
import store from '@/common/store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import getPageTitle from '@/common/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);
    // determine whether the user has obtained his permission roles through getInfo
    const hasPermissions = store.getters.permissions;
    const user = window.config.user;
    const role = window.config.role;
    if (hasPermissions) {
        if ((role===undefined || user===undefined) && to.path != '/blank') {
            next({replace: true, name:'blank'})
        } else {
            if (to.path == '/blank' && to.path != '/config/dashboard' && (role != undefined && user!=undefined)) {
                next({ replace: true, name: 'configDashboard' })
            } else {
                next();
            }
        }
    } else {
        try {
            // get user info
            // note: permissions must be a object array! such as: ['admin'] or ,['developer','editor']
            // const { permissions } = await store.dispatch('user/getInfo');

            const { permissions } = await store.dispatch('user/getInfo');

            // generate accessible routes map based on roles
            const accessRoutes = await store.dispatch(
                'permission/generateRoutes',
                permissions
            );
            // dynamically add accessible routes
            router.addRoutes(accessRoutes);

            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true });
        } catch (error) {
            // remove token and go to login page to re-login
            Message.error(error || 'Has Error');
            // redirect to login
            // window.location.href = '/login.html';
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
