<template>
  <div :class="{'has-logo': showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from './sidebar.scss';

export default {
    components: {
        SidebarItem
        // Logo
    },
    computed: {
        sidebar() {
            return this.$store.getters['app/sidebar'];
        },
        permission_routes() {
            return this.$store.getters['permission/routes'];
        },
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return true;
            // return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
<style lang="scss" scoped>
.el-menu {
    font-weight: bold;
}
</style>
