<template>
  <div class="new-consent">
    <!-- <div class="consent-button">
      <div class="save-btn">
        <el-button type="primary">Save</el-button>
      </div>
      <div class="back-btn">
        <el-button type="primary" @click="handleBack">Back</el-button>
      </div>
    </div> -->
    <div class="title">
      <!-- <span>New consent</span> -->
    </div>
    <div class="consent-content">
      <div class="content-title">
        <span>Basic Information</span>
      </div>
      <div class="card-info">
        <el-card shadow="hover">
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="200px"
            class="demo-ruleForm"
          >
            <el-form-item label="Test Consent Name" prop="consentName">
              <el-input
                :disabled="disableForView"
                v-model.trim="ruleForm.consentName"
                placeholder="enter consent name"
              ></el-input>
            </el-form-item>
            <el-form-item label="Organization" prop="organization">
              <el-select
                v-model="ruleForm.organization"
                placeholder="select a organization"
                :disabled="disableOrganization"
              >
                <el-option
                  v-for="items in organizationList"
                  :key="items.label"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
                <!-- <el-option label="SVW" value="004"></el-option>
                <el-option label="FAWVW" value="005"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="SOP" prop="consentVersion">
              <el-select
                v-model="ruleForm.consentVersion"
                placeholder="select a sop"
                :disabled="disableInput"
              >
                <el-option
                  v-for="items in soplist"
                  :label="items.bSop"
                  :key="items.bSop"
                  :value="items.bSop"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即创建</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item> -->
          </el-form>
        </el-card>
      </div>
      <div class="card-add">
        <el-card shadow="hover">
          <div class="add-vehicle">
            <div class="add-btn" @click="addData" v-if="!disableForView">
              <i class="el-icon-circle-plus f24"></i>Add Vehicle
            </div>
          </div>
          <el-table
            class="ml12"
            :data="tableData"
            empty-text="No Data"
            height="500"
            :header-cell-style="{
              background: 'rgba(55,55,65,1)',
              color: 'rgba(255,255,255,1)'
            }"
          >
            <el-table-column label="" width="42" header-align="center">
              <template slot-scope="scope" v-if="!disableForView">
                <i
                  class="el-icon-error f24 cp mr12"
                  @click="deleteData(scope.row, scope.$index)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              label="*VIN"
              prop="vin"
              width="300"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.edit"
                  :disabled="disableForView"
                  maxlength="17"
                  show-word-limit
                  v-model.trim="scope.row.vin"
                  placeholder="vin"
                ></el-input>
                <span v-else class="disabledClass">{{ scope.row.vin }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div class="consent-button">
        <div class="save-btn">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            v-if="!disableForView"
            >Save</el-button
          >
        </div>
        <div class="back-btn">
          <el-button type="primary" @click="handleBack">Back</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signal, base, consent } from "@/api";
export default {
  data() {
    var checkConsent = (rule, value, callback) => {
      var regex = /\s/;
      console.log(value, "value-------");
      if (regex.test(value)) {
        callback(new Error("Consent name cannot contain any spaces!"));
      } else if (value === "") {
        callback(new Error("Consent name cannot be empty!"));
      } else {
        callback();
      }
    };
    return {
      // user = 006 disable
      errorVIN: false,
      activeUser: "",
      consentId: "",
      userDisable: false,
      tableData: [],
      text: "",
      disableInput: false,
      formerUser: "", // user appid
      disableForView: false,
      organizationList: [
        {
          label: "SVW",
          value: "004"
        },
        {
          label: "FAWVW",
          value: "005"
        }
      ],
      formData: {
        tableData: []
      },
      ruleForm: {
        consentName: "",
        organization: "",
        consentType: "",
        consentVersion: ""
      },
      soplist: [],
      rules: {
        consentName: [
          {
            validator: checkConsent,
            trigger: "blur"
          }
        ],
        organization: [
          {
            required: true,
            message: "The Organization cannot be empty",
            trigger: "change"
          }
        ],
        consentVersion: [
          {
            required: true,
            message: "The SOP cannot be empty",
            trigger: "change"
          }
        ],
        consentType: [
          {
            required: true,
            message: "The consent type cannot be empty",
            trigger: "change"
          }
        ]
      }
    };
  },
  async destroyed() {
    await (window.config.user = this.formerUser);
  },
  computed: {
    disableOrganization() {
      return this.userDisable || this.disableInput;
    }
  },
  mounted() {
    this.handleSOP();
    this.addData();
    console.log(window.config, "window.config-============");
    this.formerUser = window.config.user;
    console.log(this.$route.query, "this.$route.query.consentInfo===========");

    let consentInfo = this.$route.query.consentInfo;
    if (consentInfo) {
      consentInfo = JSON.parse(consentInfo);
      this.disableInput = true;
      console.log(consentInfo, "consentInfo==========================");
      this.ruleForm.consentName = consentInfo.consentName;
      this.ruleForm.organization = consentInfo.appId;
      this.ruleForm.consentVersion = consentInfo.consentVersion;
      this.formerUser = window.config.user;
      window.config.user = this.ruleForm.organization;
      consentInfo.consentId &&
        this.handleQueryVin(consentInfo.consentId, consentInfo.appId);
      consentInfo.page === "view" && (this.disableForView = true);
    } else {
      this.userDisable = window.config.user === "006" ? false : true;
      this.ruleForm.organization =
        window.config.user === "006" ? "" : window.config.user;
    }
    console.log(this.$route, "route=========");
  },
  methods: {
    async handleSOP() {
      let res = await base.list();
      this.soplist = res;
    },
    async handleCreateConsent() {
      try {
        let res = await consent.create(this.ruleForm);
      } catch (error) {}
    },
    async handleQueryVin(id, appId) {
      let res = await consent.query({
        consentId: id,
        appId: appId,
        pageNo: 1,
        pageSize: 1000
      });
      this.tableData = res.data;
    },
    async handleAddVehicle(id) {
      let arr = [];
      this.errorVIN = false;
      for (let i = 0; i < this.tableData.length; i++) {
        var regex = /\s/;
        var regExp = new RegExp(`^.{17,{17}}`);
        if (regex.test(this.tableData[i].vin)) {
          this.$message.error("VIN cannot contain any spaces!");
          this.errorVIN = true;
          return false;
        }
        if (this.tableData[i].vin.length != 17) {
          this.$message.error("The length of VIN must be equal to 17.");
          this.errorVIN = true;
          return false;
        }
        arr.push({ vin: this.tableData[i].vin });
      }
      // this.tableData.forEach(item => {
      //   var regex = /\s/;
      //   if (regex.test(item.vin)) {
      //     this.$message.error("VIN cannot contain any spaces!");

      //   }
      //   return arr.push({vin: item.vin});
      // });
      // let arr = this.tableData.forEach((item) => {
      //   var regex = /\s/;
      //   if (regex.test(item.vin)) {
      //     this.$message.error("VIN cannot contain any spaces!");
      //   }
      //   return Object.assign({}, { vin: item.vin });
      // });
      console.log(this.tableData, arr, id);
      let consentInfo = this.$route.query.consentInfo;
      if (consentInfo) consentInfo = JSON.parse(consentInfo);
      let form = {
        consentId: id,
        vinList: arr,
        appId: consentInfo ? consentInfo.appId : window.config.user
      };
      try {
        let res = await consent.bind(form);
        if (res) {
          this.$message.success("bind success!");
        } else {
          this.$message.error(res);
        }
      } catch (error) {}
    },
    async handleBack() {
      await (window.config.user = this.formerUser);
      this.$router.go(-1);
    },
    addData() {
      this.tableData.push({
        edit: true
      });
    },
    deleteData(row, index) {
      //  at least one
      this.$confirm("Are you sure to unbind?", "Unbind", {
        confirmButtonText: "Sure",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(async () => {
          console.log(row, "row========123");
          if (this.$route.query.consentInfo) {
            var consentInfo = JSON.parse(this.$route.query.consentInfo);
          }
          if (row.vin && consentInfo) {
            console.log(row.vin, "row====vin-=====");
            let consentId = consentInfo.consentId;
            console.log(consentId, "row====vin-=====");

            let form = {
              consentId: consentId,
              appId: consentInfo.appId,
              vinList: [
                {
                  vin: row.vin
                }
              ]
            };
            console.log(form, "form========");
            let res = await consent.unbind(form);
            this.$message({
              type: "success",
              message: "Unbind success!"
            });
            this.tableData.splice(index, 1);
            // this.handleQueryVin(consentId);
          } else {
            console.log(row.vin, "???");
            this.tableData.splice(index, 1);
            this.$message({
              type: "success",
              message: "Unbind success!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Unbind cancel"
          });
          // this.tableData.splice(index, 1);
        });
      // this.tableData.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            // console.log(this.tableData[i],'============325');
            if (this.tableData[i].vin === undefined) {
              this.$message.error("The vin cannot be empty");
              return;
            }
          }
          let { organization, ...form } = this.ruleForm;
          this.activeUser = window.config.user;
          window.config.user = organization;
          let consentInfo = this.$route.query.consentInfo;
          if (consentInfo) {
            consentInfo = JSON.parse(consentInfo);
            let editform = {
              consentId: consentInfo.consentId,
              consentName: form.consentName,
              appId: consentInfo.appId
            };
            if (consentInfo.consentName != form.consentName) {
              let resForEdit = await consent.edit(editform);
            }
            // if (this.tableData[0].vin) {
            //   await this.handleAddVehicle(resForEdit);
            // }
            console.log(
              this.tableData,
              this.tableData[0],
              "this.tableData[0]========"
            );
            console.log(
              consentInfo,
              "this.$route.query.consentInfo=============="
            );
            if (this.tableData[0]) {
              await this.handleAddVehicle(consentInfo.consentId);
              if (this.errorVIN) return;
            }
            // await this.handleAddVehicle(
            //   this.$route.query.consentInfo.consentId
            // );
          } else {
            let createForm = {
              ...form,
              appId: window.config.user
            };
            console.log(createForm, "createForm==============");
            try {
              let res = await consent.create(createForm);
              res && this.$message.success("Create success!");
              if (this.tableData[0].vin) {
                await this.handleAddVehicle(res);
              }
            } catch (error) {
              if (error) return;
            }
          }
          await (window.config.user = this.activeUser);
          this.handleBack();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
/* eslint-disable */
.consent-button {
  position: fixed;
  top: 65px;
  right: 15px;
  z-index: 200;
  float: right;
  display: flex;
  width: 220px;
  justify-content: space-between;
  margin-top: 20px;
  ::v-deep {
    .el-button--primary {
      height: 30px;
      width: 100px;
      padding: 8px 20px;
      background: #fff;
      font-weight: 400;
      color: #333;
      cursor: pointer;
      border: none;
    }
  }
}
.new-consent {
  .title {
    font-size: 14px;
    font-weight: 500;
  }
  .consent-content {
    padding: 20px;
    .content-title {
      font-size: 18px;
      font-weight: 500;
      height: 30px;
    }
    ::v-deep .el-input__inner {
      width: 300px;
    }
  }
  .card-add {
    margin-top: 20px;
    ::v-deep .el-table {
      tr :first-child {
        background: transparent !important;
        border: none;
      }
    }
    .add-vehicle {
      height: 40px;
      background: #efefef;
      display: flex;
      align-items: center;
      padding-left: 20px;
      color: rgb(51, 51, 51) !important;
      font-size: 14px;
      margin-bottom: 20px;
      .add-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        ::v-deep .el-icon-circle-plus {
          margin-right: 5px;
        }
      }
    }
  }
}

.disabledClass {
  background-color: #f7f7f7 !important;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
  box-shadow: -10px 0px 10px #f7f7f7, 0px -10px 10px #f7f7f7,
    10px 0px 10px #f7f7f7, 0px 10px 10px #f7f7f7, 0px 0px 30px #f7f7f7 inset;
  // box-shadow: 0px 0px 50px #f7f7f7;
}
</style>
