<template>
  <div class="complete-test">
    <el-dialog
      title="Complete test"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <!-- <div class="consent-list" v-for="items in consentList" :key="items.id"> -->
      <div class="consent-list" v-loading="loading">
        <el-radio-group v-model="consentRadio">
          <el-radio
            :label="items.consentId"
            v-for="items in consentList"
            :key="items.consentId"
            size="medium"
            >{{ items.consentName }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="no-data" v-if="noData && !loading">
        No Data
      </div>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { consent } from "@/api";
export default {
  data() {
    return {
      consentRadio: "",
      consentList: [],
      loading: false
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    configId: {},
    appId: {},
    configAppId: {}
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      },
    },
  },
  computed: {
    noData() {
      return this.consentList.length===0 ? true : false;
    },
  },
  methods: {
    async handleSubmit() {
      let form = {
        configId: this.configId,
        consentId: this.consentRadio,
        appId: this.appId,
      };
      let res = await consent.update(form);
      if (res) {
        this.$emit("activeNameInTest", "2");
      }
      this.handleClose();
    },
    handleClose() {
      this.consentRadio = "";
      this.consentList = [];
      this.$emit("update:dialogVisible", false);
    },
    async init() {
      this.loading = true;
      let form = {
        dataType: 1,
        appId: this.configAppId
      };
      try {
        let res = await consent.getCompleteTest(form);
        this.consentList = res;
      } catch (error) {
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-test {
  .no-data {
    text-align: center;
    font-size: 26px;
    height: 100px;
    color: #909399;
    line-height: 100px;
  }
  .consent-list {
    .el-radio-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .el-radio {
        height: 40px;
        margin-left: 0px;
      }
    }
    .el-radio-group::after {
      content: "";
      flex: 1;
    }
  }
}
</style>
