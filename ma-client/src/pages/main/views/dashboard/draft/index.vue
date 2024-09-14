<template>
  <div class="draft" v-loading="loading">
    <div class="card-box" v-for="(items, index) in cardBox" :key="index">
      <div class="delete-button" @click="handleDelete(items)">
        <i class="el-icon-error f24"></i>
      </div>
      <el-card shadow="hover" class="box-card">
        <div class="information-box">
          <div class="content-row">
            <span>Id: {{ items.configId }}</span>
          </div>
          <div class="content-row">
            <span>Service Package Name: {{ items.configName }}</span>
          </div>
          <div class="content-row">
            <span>Consent: {{ items.consentName }}</span>
          </div>
          <div class="content-row">
            <span>Version: {{ items.configVersion }}</span>
            <span>Create Time: {{ items.createTime }}</span>
            <span>Creator: {{ items.createBy }}</span>
          </div>
        </div>
        <div class="footer">
          <el-button @click="handleToCreate('edit', items.configId, '1')" v-if="checkApproval !== 'approve'"
            >Edit</el-button
          >
          <el-button @click="handleSubmit(items)" v-if="checkApproval !== 'approve'">Submit</el-button>
          <el-button @click="handleToCreate('view', items.configId, '1')" v-if="checkApproval !== 'approve'"
            >View</el-button
          >
          <el-button @click="handleClose(items)" v-if="checkApproval !== 'approve'">Close</el-button>
        </div>
      </el-card>
    </div>
    <div class="no-data" v-if="noData">
      No Data
    </div>
  </div>
</template>

<script>
import { dashboard } from "@/api";
import { handleJumpToCreate } from "../jumpToCreate";
export default {
  data() {
    return {
      cardBox: [],
      activeAppId: '',
      loading: false
    };
  },
  props: {
    activeName: {
      type: String,
      default: "",
    }
  },
  watch: {
    activeName: {
      handler(e) {
        e === "1" && this.getList();
      }
    }
  },
  computed: {
    noData() {
      return this.cardBox.length===0 ? true : false;
    },
    checkApproval() {
      return this.$store.state.role.role
    }
  },
  mounted() {
    // this.activeAppId = window.config.user;
    this.getList();
  },
  methods: {
    handleClose(e) {
      this.$confirm("Are you sure to submit?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(async () => {
          await this.updateStatus(e,'6');
          this.$message({
            type: "success",
            message: "submit completed"
          });
          this.$emit("update:activeName", "6");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "submit canceled"
          });
        });
    },
    handleToCreate(type, id, status) {
      handleJumpToCreate(type, id, status);
    },
    async handleDelete(e) {
      this.$confirm("Are you sure to delete?", "Delete", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "error"
      })
        .then(async () => {
          let form = {
            configId: e.configId
          };
          // window.config.user = e.appId;
          let res = await dashboard.delete(form);
          this.getList();
          console.log(res, "============res");
          this.$message({
            type: "success",
            message: "delete completed"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "delete canceled"
          });
        });
    },
    async updateStatus(e, status) {
      let form = {
        configId: e.configId,
        flowStatus: status
      };
      // window.config.user = e.appId;
      let res = await dashboard.update(form);
    },
    /* update status */
    async handleSubmit(e) {
      this.$confirm("Are you sure to submit?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(async () => {
          await this.updateStatus(e, '7');
          this.$message({
            type: "success",
            message: "submit completed"
          });
          this.$emit("update:activeName", "7");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "submit canceled"
          });
        });
    },
    async getList() {
      this.loading = true;
      let form = {
        configFlowStatus: 1
      };
      // window.config.user = this.activeAppId;
      let res = await dashboard.get(form);
      this.cardBox = res;
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.draft {
  .no-data {
    text-align: center;
    font-size: 26px;
    height: 400px;
    color: #909399;
    line-height: 400px;
  }
  .card-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;
    .delete-button {
      padding: 10px;
      .el-icon-error {
        cursor: pointer;
      }
    }
    .box-card {
      width: 1620px;
      border-radius: 6px;
      border: 2px solid #88888f;
      .el-card__body {
        .information-box {
          margin-bottom: 10px;
          .content-row {
            line-height: 30px;
            font-size: 14px;

            color: rgb(51, 51, 51);
            font-family: FK CARIAD, Helvetica, PingFang SC, Hiragino Sans GB,
              Microsoft YaHei, Arial, sans-serif;
            span {
              margin-right: 20px;
            }
          }
        }
        .footer {
          height: 70px;
          display: flex;
          align-items: center;
          border-top: 1px solid #ededed;
          .el-button {
            padding: 0 46px;
            border: 2px solid #4538dc;
            border-radius: 6px;
            -webkit-box-sizing: content-box;
            box-sizing: content-box;
            height: 36px;
            line-height: 36px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
