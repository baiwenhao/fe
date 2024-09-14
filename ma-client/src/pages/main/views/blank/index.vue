<template>
  <div class="blank-page">
    <Navbar class="nav-header" :user="user">
      <template #left>
        <ProjectBar />
      </template>
    </Navbar>
    <span class="blue-line"></span>
    <span class="title-1">Access to this page is blocked.</span>
    <i class="lock-button el-icon-lock"></i>
    <span class="title-2"
      >You're not allowed to access this Application. Please contact your
      Application responsible.</span
    >
    <span class="title-3"
      >Copy right @ 2021 Volkswagen All Rights Reserved.</span
    >
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar } from "../../layout/components";
import { ProjectBar } from "@ma-dev/atom-acs-client";

export default {
  components: {
    Navbar,
  },
  computed: {
    user() {
      return {
        name: window.config.maUserName,
        avatar: this.$store.state.user.avatar,
      };
    },
  },
  mounted() {
    console.log(this.$route, "============");
  },
};
</script>

<style lang="scss" scoped>
.blank-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .nav-header {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .blue-line {
    height: 40px;
    width: 100%;
    background-color: #4538dc;
    position: fixed;
    top: 80px;
  }
  .title-1 {
    font-size: 38px;
    font-weight: 900;
    height: 250px;
    line-height: 250px;
  }
  .lock-button {
    font-size: 200px;
    line-height: 200px;
    font-weight: 10;
    color: #4538dc;
  }
  .title-2 {
    font-size: 20px;
    font-weight: 800;
    height: 200px;
    line-height: 200px;
  }
  .title-3 {
    font-size: 16px;
    height: 250px;
    font-weight: 600;
    line-height: 250px;
  }
}
</style>
