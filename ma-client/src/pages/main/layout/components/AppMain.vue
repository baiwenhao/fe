<template>
  <section class="g-app">
    <transition mode="out-in"> <!--  name="fade-transform" 去掉动画-->
    <router-view :key="key" />
    </transition>
    <div class="g-app-copyright">©2024 - CARIAD | All rights reserved</div>
  </section>
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        key() {
            return this.$route.path;
        }
    }
};
</script>

<style lang="scss" scoped>
@import 'src/pages/main/theme/var.scss';
.g-app {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: $--background-color-base;
    padding: 0 30px 50px 30px;
    &-body {
        background-color: $--color-white;
        margin-bottom: 30px;
    }
    &-copyright {
        position: absolute;
        bottom: 30px;
        left: 50%;
        width: 500px;
        margin-left: -250px;
        text-align: center;
        color: $--color-text-secondary;
    }
}
.fixed-header+.g-app {
    padding-top: 50px;
}

// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all .5s;
}

.fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
