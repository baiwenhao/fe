<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="g-side"/>
    <div class="g-cnt">
      <div :class="{'fixed-header':fixedHeader}">
        <Navbar :user="user">
          <template v-if="isJvEnable" #left>
            <ProjectBar />
          </template>
        </Navbar>
        <div class="path">{{ metaName }}</div>
      </div>
      <!-- <div class="path">
        <breadcrumb class="breadcrumb-container" />
      </div> -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar } from './components';
// import { Navbar } from '@ma-dev/navbar';
// import Breadcrumb from '@/components/Breadcrumb';
import ResizeMixin from './mixin/ResizeHandler';
import { ProjectBar } from '@ma-dev/atom-acs-client';

export default {
    name: 'Layout',
    components: {
        Navbar,
        // Breadcrumb,
        Sidebar,
        AppMain,
        ProjectBar
    },
    mixins: [ResizeMixin],
    data() {
        return {
            isJvEnable: process.env.VUE_APP_IS_JV_PROJECT === 'true'
        };
    },
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        },
        device() {
            return this.$store.state.app.device;
        },
        fixedHeader() {
            return this.$store.state.settings.fixedHeader;
        },
        metaName() {
            return this.$route.meta.title
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            };
        },
        user() {
            return {
                name: window.config.maUserName,
                avatar: this.$store.state.user.avatar
            };
        }
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
        }
    }
};
</script>

<style lang="scss">
@import 'src/pages/main/theme/var.scss';
@import './components/Sidebar/sidebar.scss';
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        &.mobile.openSidebar{
            position: fixed;
            top: 0;
        }
    }
    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }

    .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - #{$sideBarWidth});
        transition: width 0.28s;
    }

    .hideSidebar .fixed-header {
        width: calc(100% - 54px)
    }

    .mobile .fixed-header {
        width: 100%;
    }

    .g-cnt {
        min-height: 100%;
        transition: margin-left .28s;
        margin-left: $sideBarWidth;
        position: relative;
        .path {
            height: 40px;
            line-height: 40px;
            background-color: #4538dc;
            color: #fff;
        }
    }

    .g-side {
        transition: width 0.28s;
        width: $sideBarWidth !important;
        background-color: $menuBg;
        height: 100%;
        position: fixed;
        font-size: 0px;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;

        // reset element-ui css
        .horizontal-collapse-transition {
            transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
        }

        .scrollbar-wrapper {
            overflow-x: hidden !important;
        }

        .el-scrollbar__bar.is-vertical {
            right: 0px;
        }

        .el-scrollbar {
            height: 100%;
        }

        &.has-logo {
            .el-scrollbar {
            height: calc(100% - 50px);
            }
        }

        .is-horizontal {
            display: none;
        }

        a {
            display: inline-block;
            width: 100%;
            overflow: hidden;
        }

        .svg-icon {
            margin-right: 16px;
        }

        .el-menu {
            border: none;
            height: 100%;
            width: 100% !important;
        }

        // menu hover
        .submenu-title-noDropdown,
        .el-submenu__title {
            &:hover {
            background-color: $menuHover !important;
            }
        }

        .is-active>.el-submenu__title {
            color: $subMenuActiveText !important;
        }

        & .nest-menu .el-submenu>.el-submenu__title,
        & .el-submenu .el-menu-item {
            min-width: $sideBarWidth !important;
            background-color: $subMenuBg !important;

            &:hover {
            background-color: $subMenuHover !important;
            }
        }
    }

    .hideSidebar {
        .g-side {
        width: 54px !important;
        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            .el-tooltip {
            padding: 0 !important;

            .svg-icon {
                margin-left: 20px;
            }
            }
        }
        .el-submenu {
            overflow: hidden;
            /* stylelint-disable no-descending-specificity  */
            &>.el-submenu__title {
            padding: 0 !important;

            .svg-icon {
                margin-left: 20px;
            }

            .el-submenu__icon-arrow {
                display: none;
            }
            }
        }
        }

        .g-cnt {
        margin-left: 54px;
        }

        .el-menu--collapse {
        .el-submenu {
            &>.el-submenu__title {
            &>span {
                height: 0;
                width: 0;
                overflow: hidden;
                visibility: hidden;
                display: inline-block;
            }
            }
        }
        }
    }

    .el-menu--collapse .el-menu .el-submenu {
        min-width: $sideBarWidth !important;
    }

    .withoutAnimation {

        .g-cnt,
        .g-side {
        transition: none;
        }
    }
    // when menu collapsed
    .el-menu--vertical {
        &>.el-menu {
        .svg-icon {
            margin-right: 16px;
        }
    }

    .nest-menu .el-submenu>.el-submenu__title,
    .el-menu-item {
        &:hover {
        // you can use $subMenuHover
        background-color: $menuHover !important;
        }
    }

    // the scroll bar appears when the subMenu is too long
    >.el-menu--popup {
        max-height: 100vh;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }
    }
</style>
