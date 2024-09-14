<template>
  <div class="m-sidebarlogo" :class="{'m-sidebarlogo_collapse':collapse}">
    <transition name="a-sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="u-sidebarlink" to="/">
        <img v-if="logo" :src="logo" class="u-sidebarlink-logo">
        <h1 v-else class="u-sidebarlink-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="u-sidebarlink" to="/">
        <img v-if="logo" :src="logo" class="u-sidebarlink-logo">
        <h1 class="u-sidebarlink-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import metadata from 'Shared/metadata.ts';

export default {
    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            title: metadata.APPLICATION_NAME,
            logo: null
            // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
        };
    }
};
</script>

<style lang="scss" scoped>
@import 'src/pages/main/theme/var.scss';
.a-sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.a-sidebarLogoFade-enter,
.a-sidebarLogoFade-leave-to {
  opacity: 0;
}

.m-sidebarlogo {
  position: relative;
  width: 100%;
  height: 80px;
  line-height: 80px;
  // background: #2b2f3a;
  background: $--color-primary;
  text-align: center;
  overflow: hidden;

  .u-sidebarlink {
    height: 100%;
    width: 100%;

    &-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    &-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 80px;
      font-size: $--font-size-large;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &_collapse {
    .u-sidebarlink-logo {
      margin-right: 0px;
    }
  }
}
</style>
