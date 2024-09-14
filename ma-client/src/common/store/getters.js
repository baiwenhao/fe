const getters = {
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    permissions: state => state.user.permissions,
    routerStatus: state => state.user.routerIsReset
};
export default getters;
