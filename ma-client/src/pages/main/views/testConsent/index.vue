<template>
  <div class="consent" v-if="checkApproval !== 'approve'">
    <div class="header">
      <div class="create-button aic" @click="handleCreate"><i class="f24 el-icon-circle-plus mr6"></i> Add Test Consent</div>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      empty-text="No Data"
      :header-cell-style="{
        background: 'rgba(55,55,65,1)',
        color: 'rgba(255,255,255,1)'
      }"
      v-loading="loading"
    >
      <el-table-column label="" width="42">
        <template slot-scope="scope">
          <i
            class="el-icon-error f24 mr12 cp"
            @click="deleteData(scope.row, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="consentName" label="Consent Name">
      </el-table-column>
      <el-table-column label="Organization">
        <template slot-scope="scope">
          {{ transferAppId(scope.row.appId) }}
        </template>
      </el-table-column>
      <el-table-column prop="consentVersion" label="SOP"> </el-table-column>
      <el-table-column label="Control">
        <template slot-scope="scope">
          <el-button size="small" @click="changeEvent(scope.row, 'view')"
            >View</el-button
          >
          <el-button size="small" @click="changeEvent(scope.row, 'edit')"
            >Edit</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { consent } from "@/api";

export default {
  name: "testConsent",
  data() {
    return {
      loading: false,
      consent: {
        dataType: 2
      },
      apiToOrganization: [
        {
          appId: "006",
          organization: "VGC"
        },
        {
          appId: "004",
          organization: "SVW"
        },
        {
          appId: "005",
          organization: "FAWVW"
        }
      ],
      list: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    checkApproval() {
      return this.$store.state.role.role
    }
  },
  methods: {
    /* transfer appId to organization */
    transferAppId(appId) {
      let arr = this.apiToOrganization.filter(items => items.appId == appId);
      return arr[0].organization;
    },
    handleCreate() {
      this.$router.push({ path: "/testconsent/detail" });
    },
    deleteData(row, index) {
      // this.list.splice(index, 1);
      this.$confirm("Are you sure to delete?", "Delete", {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(async () => {
          let res = await consent.delete({
            consentId: row.consentId,
            appId: row.appId
          });
          this.$message({
            type: "success",
            message: "delete success!"
          });
          this.init();
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "delete cancel!"
          // });
        });
    },
    async init() {
      this.loading = true;
      try {
        let res = await consent.get(this.consent);
        this.list = res;
      } catch (error) {
      }
      this.loading = false;
      
    },
    changeEvent(v, t) {
      if (t === "view") {
        let consentInfo = JSON.parse(JSON.stringify(v));
        consentInfo.page = t;
        this.$router.push({
          path: "/testconsent/detail",
          query: {
            consentInfo: JSON.stringify(consentInfo)
          }
        });
      } else if (t === "edit") {
        let consentInfo = JSON.parse(JSON.stringify(v));
        this.$router.push({
          path: "/testconsent/detail",
          query: {
            consentInfo: JSON.stringify(consentInfo)
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.consent {
  ::v-deep .el-table {
    tr :first-child {
      background: transparent !important;
      border: none;
    }
  }
}
</style>
