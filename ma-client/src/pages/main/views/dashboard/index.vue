<template>
  <div class="m-dashboard">
    <div class="header">
      <div class="create-button aic" @click="handleCreate" v-if="checkApproval !== 'approve'">
        <i class="mr6 f24 el-icon-circle-plus"></i>Create
      </div>
      <el-link type="primary" @click="handleImport" v-if="checkApproval !== 'approve'"
        >Import Configuration Statement</el-link
      >
    </div>
    <div class="u-chart">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Draft" name="1">
          <draft :activeName.sync="activeName" v-if="activeName==='1'"></draft>
        </el-tab-pane>
        <el-tab-pane label="In Test" name="7"
          ><in-test :activeName.sync="activeName" v-if="activeName==='7'"></in-test>
        </el-tab-pane>
        <el-tab-pane label="Ready For Approval" name="2"
          ><approval :activeName.sync="activeName" v-if="activeName==='2'"></approval
        ></el-tab-pane>
        <!-- <el-tab-pane label="Ready for release" name="4"
          ><release :activeName.sync="activeName"></release
        ></el-tab-pane> -->
        <el-tab-pane label="In Process" name="5"
          ><process :activeName.sync="activeName" v-if="activeName==='5'"></process
        ></el-tab-pane>
        <el-tab-pane label="Closed" name="6"
          ><closed :activeName.sync="activeName" v-if="activeName==='6'"></closed
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  components: {
    draft: () => import("./draft"),
    "in-test": () => import("./inTest"),
    approval: () => import("./readyForApproval"),
    release: () => import("./readyForRelease"),
    process: () => import("./inProcess"),
    closed: () => import("./closed")
  },
  computed: {
    checkApproval() {
      return this.$store.state.role.role
    }
  },
  data() {
    return {
      activeName: "1"
    };
  },
  mounted() {
    if (this.$route.query.status) {
      console.log(this.$route.query.status,this.activeName,'============routeskduhoashdoas');
      this.activeName = this.$route.query.status.toString();
    }
  },
  methods: {
    handleCreate() {
      this.$router.push({
        name: "configDetail"
      });
    },
    handleImport() {
      this.$router.push({
        path: "detail",
        query: {
          type: "import"
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-dashboard {
  .u-chart {
    padding: 0 20px;
    ::v-deep {
      .el-tabs {
        .el-tabs__item {
          font-size: 14px;
          height: 50px;
          line-height: 50px;
          padding: 0px 30px;
          color: #909399;
        }
        .el-tabs__item.is-active {
          color: #4538dc;
          border-bottom: 4px solid #4538dc;
        }
        .el-tabs__active-bar {
          height: 4px;
        }
      }
    }
  }
}
</style>
