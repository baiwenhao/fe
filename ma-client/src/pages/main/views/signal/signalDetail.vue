<template>
  <div class="signal">
    <div class="back-btn">
      <el-button type="primary" @click="handleBack">Back</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      empty-text="No Data"
      v-loading="loading"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      height="680"
      :header-cell-style="{
        background: 'rgba(55,55,65,1)',
        color: 'rgba(255,255,255,1)'
      }"
    >
      <el-table-column
        v-for="(items, index) in signalTable"
        :key="index"
        :prop="items.prop"
        :label="items.label"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:12px"
      layout="total, sizes, prev, pager, next"
      :hide-on-single-page="false"
      :current-page="signal.pageNo"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="10"
      :total="total"
      @size-change="configChangeSize"
      @current-change="configChangeNo"
    />
  </div>
</template>

<script>
import { base } from "@/api";

export default {
  name: "SignalList",
  data() {
    return {
      loading: false,
      total: 0,
      signal: {
        pageNo: 1,
        pageSize: 10,
        baseId: 0
      },
      signalTable: [
        {
          prop: "lregisterId",
          label: "Rigister ID"
        },
        {
          prop: "lsignalName",
          label: "Signal name"
        },
        {
          prop: "lsignalLength",
          label: "Signal length"
        },
        {
          prop: "ldescription",
          label: "Description"
        }
      ],
      list: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    handleDelete() {},
    configChangeSize(size) {
      this.signal.pageSize = size;
      this.init();
    },
    configChangeNo(num) {
      this.signal.pageNo = num;
      this.init();
    },
    async init() {
      this.signal.baseId = this.$route.query.baselistId;
      this.loading = true;
      let res = await base.datail_for_page(this.signal);
      const { pageNo, pageSize, data, total, totalPage } = res;
      this.list = data;
      this.signal.pageNo = pageNo;
      this.signal.pageSize = pageSize;
      this.total = total;
      this.loading = false;
    },
    changeEvent(v, t) {
      if (t === "view") {
        //
      } else if (t === "edit") {
        //
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.back-btn {
  float: right;
  margin-bottom: 20px;
  // display: flex;
  // width: 165px;
  // justify-content: space-between;
}
</style>
