<template>
  <div class="mvp">
    <!-- 1. ping list -->
    <div class="group">
      <div class="group_title flex">
        <div><strong>Ping Tool</strong></div>
      </div>
      <div class="pl24 pr24">
        <div class="flex aic pb12">
          <div class="pr12">Backend name</div>
          <el-select v-model="select_backend_name" placeholder="Please enter" clearable>
            <el-option v-for="v in list_ping" :key="v.value" :label="v.label" :value="v.value" size="small" />
          </el-select>
          <div class="f1"></div>
          <el-button :disabled="pingLoading" @click="change('ping')">
            <i v-if="pingLoading" class="el-icon-loading f14" />
            <span v-if="pingLoading" ref="ping">5</span>
            <span v-if="!pingLoading">Ping</span>
          </el-button>
        </div>
        <table style="width: 100%" cellpadding="0" cellspacing="0" class="table">
          <thead>
            <tr><th v-for="(v, i) in ['Backend Name', 'URL', 'Delay', 'Result']" :key="i">{{ v }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in list_ping" v-show="select_backend_name === v.value || select_backend_name === ''" :key="i">
              <td>{{ v.label }}</td>
              <td>{{ v.value }}</td>
              <td>{{ v.delay }}</td>
              <td><div class="default_redia" :class="[v.result === 'success' ? 'green' : v.result === 'error' ? 'red' : '']" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. config list -->
    <div class="group">
      <div class="group_title flex">
        <div><strong>Config List</strong></div>
        <div class="f1"></div>
        <div class="pr12">
          <el-button type="primary" size="small" @click="change('open_config')">Upload Config</el-button>
          <input ref="file" class="file" type="file" name="file" @change="uploadFile" />
        </div>
      </div>
      <div class="pl24 pr24">
        <table v-show="list_config.length" style="width: 100%" cellpadding="0" cellspacing="0" class="table">
          <colgroup>
            <col />
            <col />
            <col width="160" />
          </colgroup>
          <thead>
            <tr>
              <th v-for="(v, i) in ['ConfigId', 'Config Name', 'Opearation']" :key="i">{{ v }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in list_config" :key="i">
              <td>{{ v.configId }}</td>
              <td>{{ v.configName }}</td>
              <td><el-button size="small" @click="change('open_config_delete', v)">Delete</el-button></td>
            </tr>
          </tbody>
        </table>
        <div v-show="list_config.length === 0" class="tac gray p24">No Data</div>
        <el-pagination
          style="margin-top:12px"
          layout="total, sizes, prev, pager, next"
          :hide-on-single-page="false"
          :current-page="page.vinPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          :total="page.configTotal"
          @size-change="configChangeSize"
          @current-change="configChangeNo" />
      </div>
    </div>

    <!-- 3. vin list -->
    <div class="group">
      <div class="group_title flex">
        <div><strong>Vin List</strong></div>
        <div class="f1"></div>
        <div class="pr12">
          <el-button type="primary" size="small" @click="change('open_vin')">Add Vin</el-button>
        </div>
      </div>
      <div class="pl24 pr24">
        <table v-show="list_vin.length" style="width: 100%" cellpadding="0" cellspacing="0" class="table">
          <colgroup>
            <col />
            <col width="160" />
          </colgroup>
          <thead>
            <tr>
              <th>VIN</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in list_vin" :key="i">
              <td>{{ v.vin }}</td>
              <td><el-button size="small" @click="change('open_vin_delete', v)">Delete</el-button></td>
            </tr>
          </tbody>
        </table>
        <div v-show="list_vin.length === 0" class="tac gray p24">No Data</div>
        <el-pagination
          style="margin-top:12px"
          layout="total, sizes, prev, pager, next"
          :hide-on-single-page="false"
          :current-page="page.vinPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          :total="page.vinTotal"
          @size-change="vinChangeSize"
          @current-change="vinChangeNo" />
      </div>
    </div>

    <!-- 4. task list -->
    <div class="group">
      <div class="group_title flex">
        <div><strong>Config Process</strong></div>
        <div class="f1"></div>
        <div class="pr12">
          <el-button type="primary" size="small" @click="change('open_task')">Create Task</el-button>
        </div>
      </div>
      <div style="overflow-y: auto;" class="pl24 pr24">
        <table v-show="list_task.length" style="width: 100%" cellpadding="0" cellspacing="0" class="table">
          <colgroup>
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th v-for="(v, i) in ['Task Id', 'TaskName', 'Config Id', 'Config Name', 'VIN', 'Config Request', 'Report Revieved', 'View Log', 'Operation']" :key="i">{{ v }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in list_task" :key="i">
              <td>{{ v.taskId }}</td>
              <td>{{ v.taskName }}</td>
              <td>{{ v.configId }}</td>
              <td>{{ v.configName }}</td>
              <td>{{ v.vin }}</td>
              <td>
                <div class="td">
                  <div class="default_redia" :class="{ 'green': v.configReqStatus === 2, 'red': v.configReqStatus === 3 }" />
                </div>
              </td>
              <!-- <td>
                <div class="td"><div class="default_redia" :class="{ 'green': v.configResStatus === 2, 'red': v.configReqStatus === 3 }" /></div>
              </td> -->
              <td>
                <div class="td"><div class="default_redia" :class="{ 'green': v.reportReceivedStatus === 2, 'red': v.reportReceivedStatus === 3 }" /></div>
              </td>
              <td><el-button size="small" :disabled="isDisabled(v)" @click="change('view', v)">View</el-button></td>
              <td><el-button size="small" :type="v.taskStatus ? 'primary' : ''" plain @click="change('open_active', v)">{{ v.taskStatus === 1 ? 'InActive' : 'Active' }}</el-button></td>
            </tr>
          </tbody>
        </table>

        <div v-show="list_task.length === 0" class="tac gray p24">No Data</div>

        <el-pagination
          style="margin-top:12px"
          layout="total, sizes, prev, pager, next"
          :hide-on-single-page="false"
          :current-page="page.taskPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          :total="page.taskTotal"
          @size-change="taskChangeSize"
          @current-change="taskChangeNo" />
      </div>
    </div>

    <!-- Config -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogConfigDelete" width="30%">
      <div style="text-align: center;">Are you sure you want to Delete ? <strong>{{ active.config.configId }}</strong></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfigDelete = false">Cancel</el-button>
        <el-button type="primary" @click="change('config_delete')">Delete</el-button>
      </span>
    </el-dialog>

    <!-- Vin -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVin" width="30%">
      <el-form ref="vinForm" label-width="60px" :model="active" :rules="vinRules">
        <el-form-item label="vin" prop="vin">
          <el-input v-model="active.vin" maxlength="17" clearable show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVin = false">Cancel</el-button>
        <el-button type="primary" @click="change('vin')">Create</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVinDelete" width="30%">
      <div style="text-align: center">Are you sure you want to Delete ? <strong>{{ active.vin }}</strong></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVinDelete = false">Cancel</el-button>
        <el-button type="primary" @click="change('vin_delete')">Delete</el-button>
      </span>
    </el-dialog>

    <!-- Task -->
    <el-dialog id="taskDialog" :title="dialogTitle" :visible.sync="dialogTask" width="30%">
      <el-form ref="taskForm" label-width="100px" :model="task" :rules="taskRules">
        <el-form-item label="taskName" prop="taskName" size="small" clearable>
          <el-input v-model="task.taskName" placeholder="Please enter taskName" />
        </el-form-item>
        <el-form-item label="config" prop="configId">
          <el-select v-model="task.configId" placeholder="please choose config" size="small" clearable>
            <el-option v-for="(v, i) in list_config" :key="i" :label="v.configId" :value="v.configId" size="small" />
          </el-select>
        </el-form-item>
        <el-form-item label="vin" prop="vin">
          <el-select v-model="task.vin" placeholder="please choose config" size="small" clearable>
            <el-option v-for="(v, i) in list_vin" :key="i" :label="v.vin" :value="v.vin" size="small" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTask = false">Cancel</el-button>
        <el-button type="primary" @click="change('task')">OK</el-button>
      </span>
    </el-dialog>

    <!-- Task log -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogLog" width="50%">
      <el-divider content-position="left">configReqStatus</el-divider>
      <div class="pb12">
        <el-input v-if="active.task.configReqLog" v-model="active.task.configReqLog" type="textarea" autosize />
        <div v-else style="text-align: center;" class="gray">No Data</div>
      </div>
      <!-- <el-divider content-position="left">configResStatus</el-divider> -->
      <!-- <div class="pb12">
        <div v-if="active.task.configResLog">{{ active.task.configResLog }}</div>
        <div v-else style="text-align: center;" class="gray">No Data</div>
      </div> -->
      <el-divider content-position="left">reportRecivedStatus</el-divider>
      <div class="pb12">
        <div v-if="active.task.reportReceivedLog">{{ active.task.reportReceivedLog }}</div>
        <div v-else style="text-align: center;" class="gray">No Data</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLog = false">Close</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogActive" width="30%">
      <div style="text-align: center">{{ active.task.taskStatus !== 1 ? 'Do you want to Activate' : 'Do you want to Close' }} ? <strong>{{ active.task.taskName }}</strong></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogActive = false">Cancel</el-button>
        <el-button type="primary" @click="change('active')">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { vin, Ping, config, task } from '@/api'
  import data from './data.json'
  import axios from 'axios'
  // import { saveAs } from 'file-saver'

  export default {
    data() {
      return {
        pingLoading: false,
        pingTime: null,
        loading: null,
        vinRules: {
          vin: [
            { required: true, message: 'Please enter vin', trigger: 'blur' },
            { min: 17, max: 17, message: 'vin length is 17 digits', trigger: 'blur' }
            // { type: 'number', message: 'must be a number'}
          ]
        },
        active: {
          vin: '',
          config: {},
          task: {},
          taskLog: ''
        },
        dialogTitle: '...',
        dialogConfig: false,
        dialogConfigDelete: false,
        dialogVin: false,
        dialogVinDelete: false,
        dialogTask: false,
        dialogLog: false,
        dialogActive: false,
        page: {
          vinNo: 1,
          vinSize: 10,
          vinTotal: 0,
          taskNo: 1,
          taskSize: 10,
          taskTotal: 0,
          configNo: 1,
          configSize: 10,
          configTotal: 0
        },
        select_backend_name: '',
        list_ping: data.ping,
        list_config: [],
        list_vin: [],
        list_task: [],
        task: {
          vin: '',
          configId: '',
          taskName: ''
        },
        taskRules: {
          vin: { required: true, message: 'Please enter vin' },
          configId: { required: true, message: 'Please select config' },
          taskName: { required: true, message: 'Please enter taskName' }
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      isDisabled(v) {
        if (v.configReqLog || v.reportReceivedLog) { // || v.configResLog
          return false
        }
        return true
      },
      init() {
        this.vinGet()
        this.configGet()
        this.taskGet()
      },
      change(t, v) {
        if (t === 'open_config') {
          this.$refs.file.click()
        } else if (t === 'open_vin') {
          this.dialogTitle = 'Create vin'
          this.dialogVin = true
          this.active.vin = ''
          if (this.$refs.vinForm) this.$refs.vinForm.resetFields()
        } else if (t === 'open_task') {
          this.dialogTitle = 'Create task'
          this.dialogTask = true
          this.active.task = {}
          setTimeout(() => {
            this.$refs.taskForm.resetFields()
          }, 0)
        } else if (t === 'open_vin_delete') {
          this.dialogTitle = 'Delete VIN'
          this.dialogVinDelete = true
          this.active.vin = v.vin
        } else if (t === 'open_config_delete') {
          this.dialogTitle = 'Delete Config'
          this.dialogConfigDelete = true
          this.active.config = v
        } else if (t === 'vin') {
          this.vinCreate()
        } else if (t === 'vin_delete') {
          this.dialogVinDelete = false
          this.vinDelete()
        } else if (t === 'config_delete') {
          this.dialogConfigDelete = true
          this.configDelete()
        } else if (t === 'task') {
          this.taskCreate()
        } else if (t === 'view') {
          this.dialogTitle = 'View Log'
          this.dialogLog = true
          this.active.task = v
        } else if (t === 'open_active') {
          this.dialogTitle = 'Control state'
          this.dialogActive = true
          this.active.task = v
        } else if (t === 'ping') {
          this.ping()
        } else if (t === 'active') {
          this.dialogActive = false
          this.taskActive()
        }
      },
      toggleLoading(status) {
        if (status) {
          this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          })
        } else {
          this.loading.close()
        }
      },
      ping() {
        let count = 0
        let second = 5
        this.pingLoading = true
        clearInterval(this.pingTime)
        this.pingTime = setInterval(() => {
          this.$refs.ping.innerHTML = second
          second -= 1
        }, 1000)

        const all = this.list_ping
        for (let i = 0; i < all.length; i++) {
          all[i].result = ''
        }

        for (let i = 0; i < all.length; i++) {
          const p = new Ping()
          p.ping(all[i].value, (err, data) => {
            count += 1
            if (!err) {
              all[i].result = 'success'
            } else {
              all[i].result = 'error'
            }
            all[i].delay = data
            if (count === all.length - 1) {
              this.pingLoading = false
              clearInterval(this.pingTime)
            }
          })
        }
      },
      configGet() {
        config.get({
          pageNo: this.page.configNo,
          pageSize: this.page.configSize
        }).then((res) => {
          if (res) {
            this.list_config = res.data
            this.page.configTotal = res.total
          }
        })
      },
      configDelete() {
        config.delete({
          configId: this.active.config.configId
        }).then((res) => {
          if (res) {
            this.dialogConfigDelete = false
            this.$message.success('success')
            this.configChangeNo(1)
          }
        }).catch(() => {
          this.dialogConfigDelete = false
        })
      },
      uploadFile(e) {
        const file = e.target.files
        if (!file || !file[0]) return this.$message.warning('File format error')
        this.toggleLoading(true)
        const form = new FormData()
        form.append('file', file[0])
        axios.post('/v1/web/profile/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data', appId: window.config.user, userId: window.config.maUserName },
          transformRequest: [(data) => { return data }],
          timeout: 300000
        }).then((res) => {
          if (res && res.data) {
            res = res.data
            console.log(res)
            if (res.data && res.data.respCode === 0) {
              this.$message.success('Upload successful')
              this.configChangeNo(1)
            } else {
              this.$message.fail('Upload fail')
            }
          }
          this.$refs.file.value = ''
          this.toggleLoading(false)
        }).catch(() => {
          this.$refs.file.value = ''
          this.toggleLoading(false)
        })
      },
      vinGet() {
        vin.get({
          pageSize: this.page.vinSize,
          pageNo: this.page.vinNo
        }).then((res) => {
          if (res) {
            this.list_vin = res.data
            this.page.vinTotal = res.total
          }
        })
      },
      vinCreate() {
        this.$refs.vinForm.validate((valid) => {
          if (valid) {
            this.dialogVin = false
            this.toggleLoading(true)
            vin.post({ vin: this.active.vin }).then((res) => {
              this.toggleLoading(false)
              if (res) {
                this.$message.success('Create vin:' + this.active.vin + ' succeeded')
                this.page.vinNo = 1
                this.vinGet()
              }
            }).catch(() => {
              this.toggleLoading(false)
            })
          } else {
            return false
          }
        })
      },
      vinDelete() {
        vin.delete({ vin: this.active.vin }).then((res) => {
          if (res) {
            this.$message.success('Delete vin succeeded')
            this.page.vinNo = 1
            this.vinGet()
          }
        })
      },
      taskGet() {
        task.get({
          pageSize: this.page.taskSize,
          pageNo: this.page.taskNo
        }).then((res) => {
          if (res) {
            this.list_task = res.data
            this.page.taskTotal = res.total
          }
        })
      },
      taskCreate() {
        this.$refs.taskForm.validate((v) => {
          if (v) {
            for (let i = 0; i < this.list_config.length; i++) {
              if (this.list_config[i].configId === this.task.configId) {
                this.task.configName = this.list_config[i].configName
              }
            }
            task.post(this.task).then((res) => {
              if (res) {
                this.$message.success('Created the task successfully')
                this.taskChangeNo(1)
              }
              this.dialogTask = false
            })
          }
        })
      },
      taskActive() {
        task.status({
          taskId: this.active.task.taskId,
          taskStatus: this.active.task.taskStatus === 1 ? 0 : 1
        }).then((res) => {
          if (res) {
            this.$message.success('Successful operation')
            this.taskChangeNo()
          }
        })
      },
      configChangeSize(n) {
        this.page.configSize = n
        this.configGet()
      },
      configChangeNo(n) {
        this.page.configNo = n
        this.configGet()
      },
      vinChangeSize(n) {
        this.page.vinSize = n
        this.vinGet()
      },
      vinChangeNo(n) {
        this.page.vinNo = n
        this.vinGet()
      },
      taskChangeSize(n) {
        this.page.taskSize = n
        this.taskGet()
      },
      taskChangeNo(n) {
        if (n) this.page.taskNo = n
        this.taskGet()
      }
    }
  }
</script>
