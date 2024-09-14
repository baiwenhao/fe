import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Cookies from 'js-cookie';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';// element-ui lang
import enLocale from './en';
import zhLocale from './zh';
import maLocale from '@ma-dev/locale';

Vue.use(VueI18n);

const messages = {
    en_US: {
        ...enLocale,
        ...elementEnLocale,
        ...maLocale.en_US
    },
    zh_CN: {
        ...zhLocale,
        ...elementZhLocale,
        ...maLocale.zh_CN
    }
};
export function getLanguage() {
    const chooseLanguage = Cookies.get('language');
    if (chooseLanguage) return chooseLanguage;

    // if has not choose language
    const language = (navigator.language || navigator.browserLanguage).toLowerCase();
    const locales = Object.keys(messages);
    for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
            return locale;
        }
    }
    return 'en';
}
const i18n = new VueI18n({
    // set locale
    // options: en | zh | es
    locale: getLanguage(),
    // set locale messages
    messages
});

export default i18n;
