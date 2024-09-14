<template>
  <div class="signal">
    <div class="header" />
    <el-table
      :data="list"
      style="width: 100%"
      empty-text="No import file"
      :v-loading="baselistLoading"
      :header-cell-style="{
        background: 'rgba(55,55,65,1)',
        color: 'rgba(255,255,255,1)'
      }"
    >
      <el-table-column type="Number" width="50"> </el-table-column>
      <el-table-column
        v-for="(items, index) in signalTable"
        :key="index"
        :prop="items.prop"
        :label="items.label"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="Detail">
        <template slot-scope="scope">
          <el-button size="small" @click="changeEvent(scope.row, 'view')"
            >View</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="Excel File">
        <template slot-scope="scope">
          <el-button size="small" @click="changeEvent(scope.row, 'download')"
            >Download</el-button
          >
          <el-button size="small" @click="changeEvent(scope.row, 'upload')" v-if="checkApproval === 'admin'"
            >Upload</el-button
          >
          <!-- <el-button size="small" @click="changeEvent(scope.row, 'upload')"
            >Upload</el-button
          > -->
          <!-- <el-button size="small" @click="initObs">UploadOBS</el-button> -->
          <input
            ref="file"
            class="file"
            type="file"
            name="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            @change="uploadFile"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { signal, base } from "@/api";
import axios from "axios";
// import ObsClient from "esdk-obs-nodejs";
// import ObsClient from "esdk-obs-browserjs";

// var obsClient = new ObsClient({
//   access_key_id: "ONEPJRX4B8CGPB14XE9L",
//   secret_access_key: "kB3bwFeiVf0BT2yD1cv7KS2cXPsgpkxnSx0iDVi2",
//   server: "obs.cn-north-4.myhuaweicloud.com"
// });
export default {
  name: "SignalList",
  data() {
    return {
      fileName: "",
      baselistLoading: false,
      signal: {
        pageNo: 1,
        pageSize: 10
      },
      signalTable: [
        {
          prop: "bName",
          label: "Baselist Name"
        },
        {
          prop: "bType",
          label: "Type"
        },
        {
          prop: "bPlatform",
          label: "Platform"
        },
        {
          prop: "bSop",
          label: "SOP"
        },
        {
          prop: "bListId",
          label: "Baselists Id"
        }
      ],
      list: [
        // {
        //   createTime: "example time",
        //   type: "example type",
        //   name: "example platform",
        //   sop: "/",
        //   platform: "/"
        // },
        // {
        //   createTime: "example time",
        //   type: "example type",
        //   name: "example platform",
        //   sop: "/",
        //   platform: "/"
        // },
        // {
        //   createTime: "example time",
        //   type: "example type",
        //   name: "example platform",
        //   sop: "/",
        //   platform: "/"
        // },
        // {
        //   createTime: "example time",
        //   type: "example type",
        //   name: "example platform",
        //   sop: "/",
        //   platform: "/"
        // },
        // {
        //   createTime: "example time",
        //   type: "example type",
        //   name: "example platform",
        //   sop: "/",
        //   platform: "/"
        // }
      ]
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    checkApproval() {
      return this.$store.state.role.role
    }
  },
  methods: {
    handleDelete() {},
    init() {
      this.baselistLoading = true;
      base.list().then(res => {
        this.list = res;
        this.baselistLoading = false;
      });
    },
    downloadOBS() {
      // obsClient.getObject(
      //   {
      //     Bucket: "obs-rtg-service-nprod-01",
      //     Key: this.fileName + ".xlsx",
      //     // Range: "bytes=0-10"
      //     SaveByType: "file"
      //     // SaveAsStream: true
      //   },
      //   (err, result) => {
      //     if (err) {
      //       console.error("Error-->" + err);
      //     } else {
      //       console.log(result, "result======");
      //       if (result.CommonMsg.Status < 300) {
      //         // const blob = new Blob([result.InterfaceResult.Content], {
      //         //   type:
      //         //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      //         // });
      //         // console.log(blob, "blob==========");
      //         // const fileName = result.headers["content-disposition"].split(
      //         //   "="
      //         // )[1];

      //         const fileName = "1";
      //         // // console.log(fileName, "fileName==========");
      //         const elink = document.createElement("a");
      //         elink.download = fileName;
      //         elink.style.display = "none";
      //         elink.href = result.InterfaceResult.Content.SignedUrl;
      //         document.body.appendChild(elink);
      //         elink.click();
      //         URL.revokeObjectURL(elink.href); // 释放URL 对象
      //         document.body.removeChild(elink);
      //         this.$message.success("Download success!");
      //         console.log(
      //           result.InterfaceResult.Content.SignedUrl,
      //           "=========="
      //         );

      //         console.log("RequestId-->" + result.InterfaceResult.RequestId);
      //         console.log("ETag-->" + result.InterfaceResult.ETag);
      //         console.log("VersionId-->" + result.InterfaceResult.VersionId);
      //         console.log(
      //           "ContentLength-->" + result.InterfaceResult.ContentLength
      //         );
      //         console.log(
      //           "DeleteMarker-->" + result.InterfaceResult.DeleteMarker
      //         );
      //         console.log(
      //           "LastModified-->" + result.InterfaceResult.LastModified
      //         );
      //         console.log(
      //           "StorageClass-->" + result.InterfaceResult.StorageClass
      //         );
      //         console.log(
      //           "Content-->" + result.InterfaceResult.Content.toString()
      //         );
      //         console.log(
      //           "Metadata-->" + JSON.stringify(result.InterfaceResult.Metadata)
      //         );
      //       } else {
      //         console.log("Code-->" + result.CommonMsg.Code);
      //         console.log("Message-->" + result.CommonMsg.Message);
      //       }
      //     }
      //   }
      // );

      base.downloadOBS({ signalFileName: this.fileName })
      .then((res) => {
        console.log(res.data.SignedUrl,'res==========');
        if (res && res.data.SignedUrl) {
          window.open(res.data.SignedUrl)
        } else {
          this.$message.warning('unable to download')
        }
      }).catch(() => {
        this.$message.warning('interface error')
      })
    },
    // uploadToOBS(obsClient, file) {},
    async uploadFile(e) {
      console.log('================================???upload FIle');
      const file = e.target.files;
      console.log(file[0].type, '1================================???upload FIle');

      if (!file || !file[0] || file[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) return this.$message.error("File format error");
      // this.toggleLoading(true)
      console.log('================================???upload FIle');

      // const form = new FormData();
      // form.append("file", file[0]);
      // await this.initObs(file[0], this.fileName);
      let fileName = this.fileName
      console.log(file,fileName,'===============file filename');
      const fr = new FileReader()
      console.log(fr,'FileReader================');
      // fr.onload = (e) => {
        // try {
        //   const workbook = XLSX.read(fr.result, { type: 'binary' })
        //   if (!workbook.Workbook) {
        //     // loading.close()
        //     this.$refs.file.value = '';
        //     return this.$message.warning('Not standard excel content')
        //   }
        //   console.log(workbook, "form=========111");
        // } catch (err) {
        //   console.log(err)
        //   // loading.close()
        //   this.$refs.file.value = '';
        //   return this.$message.warning('fail to read file ')
        // }
        // signalFileName = signalFileName.split('/').join('')
        // const name = signalFileName + fileName.slice(fileName.lastIndexOf('.'))
        const form = new FormData()
        form.append('fileName', fileName)
        form.append('excel', file[0])
        console.log(form,'form=============');
        axios.post('/v1/web/base/list/uploadToOBS', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: [(data) => { return data }],
          timeout: 300000
        }).then((res) => {
          console.log(res,'res====================');
          if(res.data.respCode) {
            this.$message.success(res.data.msg);
          }
          this.$refs.file.value = '';
          // if (res.data.respCode === 1) {
          //   signal.updateSignalFileAddress({
          //     signalBaseInfoId: this.listActive.signalBaseInfoId,
          //     signalFileAddress: 'excel/' + name
          //   }).then((res) => {
          //     if (res) {
          //       this.$message.success('upload success')
          //       this.listActive.signalFileAddress = true
          //     } else {
          //       this.$message.warning('uploadExcel fileAddress Failed')
          //     }
          //     this.init()
          //   })
          // }
        }).catch((error) => {
          this.$message.error(error);
          this.$refs.file.value = '';
        })
      // }
      // axios
      //   .post("/v1/web/base/list/upload", form, {
      //     headers: {
      //       "Content-Type": "multipart/form-data"},
      //     transformRequest: [
      //       data => {
      //         return data;
      //       }
      //     ],
      //     timeout: 300000
      //   })
      // //   .then(res => {
      // try {
      //   let res = await base.upload_base_list(form);
      //   if (res && res.data) {
      //     res = res.data.data;
      //     console.log(res, "===============");
      //     if (res.data && res.data.respCode === 0) {
      //       this.$message.success("Upload successful");
      //       // this.configChangeNo(1)
      //     } else {
      //       this.$message.error(res.respMsg);
      //     }
      //   }
      //   this.$refs.file.value = "";
      // } catch (error) {
      //   this.$refs.file.value = "";
      //   // this.toggleLoading(false)
      // }
    },
    changeEvent(v, t) {
      let timeInMs = Date.now();
      this.fileName = v.bName;
      if (t === "view") {
        //
        console.log(v, "v========");
        this.$router.push({
          path: "/signal/detail",
          query: {
            baselistId: v.bId
          }
        });
      } else if (t === "download") {
        this.downloadOBS();
      } else if (t === "upload") {
        this.$refs.file.click();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.signal {
  .file {
    position: fixed;
    top: -100px;
  }
}
</style>
