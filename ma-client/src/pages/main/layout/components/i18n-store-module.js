export default {
    namespaced: true,
    state: {
        currentLanguage: 'en_US' // zh_CN
    },
    mutations: {
        changeLanguage(state, lang) {
            state.currentLanguage = lang;
        }
    }
};
