import './theme/index.scss';
if (window.static_url) __webpack_public_path__ = window.static_url // eslint-disable-line

import Vue from 'vue';
import Cookies from 'js-cookie';
import '@/styles/selection.css'
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css
import App from './App';
import store from '@/common/store';
import router from './router';
import appStore from './store';

import i18n from '@/lang'; // internationalizatio
import '@/icons';
import './permission'; // permission control

import * as filters from '@/common/filters'; // global filters

// use ElementUI
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
});

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// register app store module
Object.keys(appStore).forEach(key => {
    store.registerModule(key, appStore[key]);
});
const permissions = window.config && window.config.permissions
if (permissions) {
  for (let i = 0; i < permissions.length; i++) {
    const arr = permissions[i].split(':')
    window.config[arr[0]] = arr[1]
  }
}

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
});
