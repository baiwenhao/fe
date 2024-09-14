<template src="./template.html"></template>

<script>
import data from './data.json'
import selection from './selection'
import select from '@/assets/select.png'
import add from '@/assets/add.png'
import del from '@/assets/del.png'
import { base, dashboard, consent } from '@/api'
import { toolMove, lock } from '@/common/utils'
import { baseInfo, controlSet, signal_base, signal_selected, isRepeat, handle, __triggerValue, delay, handerRepeat, generateMixed } from './utils'
const createReport = '{ "triggerList": null, "signalList": [], "registerList": [], "privacyMode": "NON GEO DATA", "triggerTypeName": "By Trigger", "configFrequency": null, "__signalList": [], "key": 9527 }'

export default {
  data() {
    return {
      add,
      del,
      select,
      type: 'add',
      commonWidth: '30%',
      config: {},
      baseInfo,
      controlSet,
      triggerValue: __triggerValue, // trigger check

      // dialog
      dialogStatus: false,
      dialogDelete: false,
      dialogDetail: false,
      dialogComment: false,
      dialogTitle: 'Comment',
      dialogContent: 'loading',
      activeDetail: 'Logical',

      // 1
      versionList: [],
      consentList: [],
      configRtgIni: [],

      // 2
      baseListId: '',
      baseList: [],
      lBaseListLogicalValueList: [],
      lBaseListPhysicalValueList: [],

      // 3
      eventTypeList: data.eventType,
      operatorList: data.operator,
      unitList: data.unit,
      triggerList: [],

      // 4
      registerList: [],
      privacyList: [],
      frequencyList: [],
      geoList: []
    }
  },
  computed: {
    idDisabledRegisters: function() {
      if (this.type === 'view') return true
      return this.registerList.length === 0
    }
  },
  created() {
    const query = this.$route.query
    if (query.type) this.type = query.type
    this.init()
  },
  mounted() {
    if (this.type === 'view') document.querySelector('#signal_list').classList.add('view')
  },
  methods: {
    init() {
      window.__externalEvent = this.externalEvent
      signal_base.__vue = this
      signal_selected.__vue = this
      selection.__vue = this

      this.consentList = []
      base.ini().then((res) => {
        if (res) {
          if (this.type === 'add') {
            for (let i = 0; i < res.length; i++) {
              this.config.configRtgIni.push(res[i].rtgIniCode)
            }
          }
          this.configRtgIni = res
        }
      })

      base.version().then((res) => {
        if (res) {
          if (res.length === 1) this.config.configVersion = res[0].versionValue
          this.versionList = res
        }
      })

      base.privacy().then((res) => {
        if (res) {
          const arr = []
          for (let i = 0; i < res.length; i++) {
            // if (res[i].id !== 3 && res[i].privacyName !== 'GEO DATA') { // remove geo data
            arr.push(res[i])
            // }
          }
          this.privacyList = arr
        }
      })

      base.trigger().then((res) => { if (res) this.frequencyList = res })

      base.register().then((res) => {
        if (res) {
          // const arr = []
          // for (let i = 0; i < res.length; i++) { // remove Privacy Status Register
          //   if (res[i].id !== 1) {
          //     arr.push(res[i])
          //   }
          // }
          this.registerList = res
        }
      })

      base.list().then((result) => {
        if (result) this.baseList = result
        if (this.type === 'edit' || this.type === 'view') {
          const baseId = this.$route.query.id
          if (baseId) {
            this.setLoading()
            base.getDetail({ configId: baseId }).then((res) => {
              this.setLoading('close')
              this.setDetail(res)
            }).catch(() => this.setLoading('close'))
          } else {
            this.message('Missing parameter')
            this.$router.replace({ name: 'configDashboard', query: { type: 'draft' }})
          }
        }
      })

      if (this.type !== 'view') {
        consent.getCompleteTest({ dataType: 2, appId: '006' }).then((res) => {
          if (res) {
            if (this.config.consentId && this.config.consentName && this.config.appId) {
              console.log('consent result, add one consnet')
              if (this.type !== 'import') {
                res.unshift({
                  consentId: this.config.consentId,
                  consentName: this.config.consentName,
                  appId: this.config.appId
                })
              }
            }
            this.consentList = res
          }
        })
      }

      if (this.type === 'import') {
        data.config.controlSets = [JSON.parse(createReport)] // reset
        this.showDialogImport()
      } else if (this.type === 'add') {
        data.config.triggerList = [] // { _id: getUuiD(), triggerName: 'test_0', compareTriggerList: [{}], eventType: 'compare', signal: null, triggerValue: null, description: null }
        data.config.controlSets = [JSON.parse(createReport)]
        data.config.signals = []
        data.config.compareTriggers = []
        data.config.evaluateTriggers = []
        data.config.configRtgIni = []
        data.trigger._id = 'test_new'
        this.$nextTick(() => {
          this.computerEventType()
        })
      }

      this.config = Object.assign({ configFrequency: 60 }, data.config)
    },
    resetData() {
        //
    },
    setDetail(res) {
      // 导入和查询 填充数据
      if (res) {
        this.config.appId = res.appId
        this.config.configId = res.configId
        this.config.configName = res.configName
        this.config.configVersion = res.configVersion
        this.config.consentId = res.consentId
        this.config.configRtgIni = res.configRtgIni
        this.config.configDataSets = res.configDataSets
        this.config.configFrequency = res.configFrequency
        this.config.description = res.description
        this.config.consentName = res.consentName

        if (this.type === 'import') {
          // const compareTriggers = res.compareTriggers
          // if (compareTriggers && compareTriggers.length) {
          //   for (let i = 0; i < compareTriggers.length; i++) {
          //     delete compareTriggers[i].signalOffset
          //     delete compareTriggers[i].signalScaling
          //   }
          // }

          this.config.consentId = ''
          const arr = []
          const list = []
          if (res.signals && res.signals.length) {
            for (let i = 0; i < res.signals.length; i++) {
              // 导入信号存在相同的信号
              if (arr.indexOf(res.signals[i].signalRegisterId) <= -1) {
                arr.push(res.signals[i].signalRegisterId)
                list.push(res.signals[i])
              }
            }
            res.signals = list
          }
        }

        if ((this.type === 'edit') && this.consentList.length) {
          if (this.config.consentId && this.config.consentName && this.config.appId) {
            this.consentList.unshift({
              consentId: this.config.consentId,
              consentName: this.config.consentName,
              appId: this.config.appId
            })
          }
        }

        // signal
        if (res.signals && res.signals.length) {
          const baseListId = res.signals[0].baseListId // 默认只有一个
          if (baseListId) {
            // 确保配置是存在的
            for (let i = 0; i < this.baseList.length; i++) {
              if (this.baseList[i].bListId === baseListId) {
                this.config.baseListId = this.baseList[i].bId
                break
              }
            }

            if (this.config.baseListId) {
              this.getSignalDetail(res, () => {
                // init
                if (!res.compareTriggers) res.compareTriggers = []
                if (!res.evaluateTriggers) res.evaluateTriggers = []
                if (!res.controlSets) res.controlSets = []

                if (res.compareTriggers.length) {
                  // 过滤 triggerName 相同的数据
                  const __list = []
                  const __triggerName = []
                  for (let i = 0; i < res.compareTriggers.length; i++) {
                    if (__triggerName.indexOf(res.compareTriggers[i].triggerName) <= -1) {
                      res.compareTriggers[i].compareTriggerList = [{}] // 切换 type 必须字段
                      res.compareTriggers[i]._id = 'C' + i
                      res.compareTriggers[i].disabled = false
                      __triggerName.push(res.compareTriggers[i].triggerName)
                      __list.push(res.compareTriggers[i])
                    } else {
                      // console.log(res.compareTriggers[i])
                    }
                  }
                  res.compareTriggers = __list
                }

                if (res.evaluateTriggers.length) {
                  for (let i = 0; i < res.evaluateTriggers.length; i++) {
                    // res.evaluateTriggers[i].__triggerList = JSON.parse(JSON.stringify(res.compareTriggers))
                    const compareTriggerList = JSON.parse(JSON.stringify(res.compareTriggers))
                    if (!res.evaluateTriggers._id) res.evaluateTriggers._id = 'evaluateTriggers_' + i

                    const __id = []
                    let compareNameList = res.evaluateTriggers[i].compareTriggerList // ['test_1', 'test_3'] 导入数据存在相同triggerName

                    if (compareNameList && compareNameList.length) {
                      compareNameList = handerRepeat(compareNameList) // 去重

                      // 处理过滤已选trigger 和 需要disabled 的 trigger
                      for (let n = 0; n < compareNameList.length; n++) {
                        const triggerName = compareNameList[n].replace(/\s/g, '')
                        if (compareTriggerList.length) {
                          for (let k = 0; k < compareTriggerList.length; k++) {
                            if (compareTriggerList[k] && compareTriggerList[k].triggerName === triggerName) {
                              compareTriggerList[k].disabled = true
                              __id.push({ _id: compareTriggerList[k]._id }) // name to id
                            }
                          }
                        } else {
                          res.evaluateTriggers[i].compareTriggerList = []
                        }
                      }
                    }
                    res.evaluateTriggers[i].__triggerList = compareTriggerList
                    res.evaluateTriggers[i].compareTriggerList = __id
                  }
                }

                if (res.controlSets) {
                  for (let i = 0; i < res.controlSets.length; i++) {
                    if (res.controlSets[i].triggerList && res.controlSets[i].triggerList.length) res.controlSets[i].triggerList = res.controlSets[i].triggerList[0]
                  }
                }

                this.triggerList = res.compareTriggers

                this.config.triggerList = res.compareTriggers.concat(res.evaluateTriggers)
                // console.log(this.config.triggerList)
                // console.log(res.compareTriggers.concat(res.evaluateTriggers))
                // console.log(JSON.stringify(res.compareTriggers))
                // console.log(JSON.stringify(res.evaluateTriggers))

                // code to name
                if (res.controlSets) {
                  for (let i = 0; i < res.controlSets.length; i++) {
                    const privacyMode = res.controlSets[i].privacyMode
                    for (let n = 0; n < this.privacyList.length; n++) {
                      if (this.privacyList[n].privacyCode === privacyMode) {
                        res.controlSets[i].privacyMode = this.privacyList[n].privacyName
                      }
                    }
                    if (!res.controlSets[i].triggerTypeName) res.controlSets[i].triggerTypeName = 'By Trigger' // default
                  }
                } else {
                  res.controlSets = []
                }

                // controlSets
                if (this.registerList.length && res.controlSets.length) {
                  /*
                  controlName: "Cl15 Counter Register"
                  id: 3
                  operationCode: "0x3002"
                  controlName: "Config Counter Register"
                  id: 4
                  operationCode: "0x3003"
                   */

                  // registerList 处理后端返回2用户导入3的问题
                  const __code = []
                  for (let m = 0; m < this.registerList.length; m++) __code.push(this.registerList[m].operationCode)
                  for (let k = 0; k < res.controlSets.length; k++) {
                    const registerList = res.controlSets[k].registerList
                    if (registerList && registerList.length) {
                      const __registerList = []
                      for (let l = 0; l < registerList.length; l++) {
                        if (__code.indexOf(registerList[l]) >= 0) {
                          __registerList.push(registerList[l])
                        }
                      }
                      res.controlSets[k].registerList = __registerList
                    }
                  }
                }

                this.setSignal(res.signals)

                // controlSets signal check
                for (let p = 0; p < res.controlSets.length; p++) {
                  const signalList = res.controlSets[p].signalList

                  if (signalList && signalList.length) {
                    if (this.config.signals && this.config.signals.length) {
                      const __signalList = signalList.slice(0)
                      const __list = []

                      for (let q = 0; q < this.config.signals.length; q++) {
                        const signalRegisterId = this.config.signals[q].signalRegisterId
                        const n = __signalList.indexOf(signalRegisterId)
                        if (n >= 0) {
                          __list.push(__signalList.splice(n, 1)[0])
                        }
                      }

                      res.controlSets[p].signalList = __list

                      if (__signalList.length >= 1) {
                        if (document.querySelector('#controlset_signal')) document.querySelector('#controlset_signal').innerHTML = 'Lost signal signalRegisterId：' + __signalList.join(',')
                      } else {
                        console.log('Controlset = All signals match')
                      }
                    } else {
                      if (document.querySelector('#controlset_signal')) document.querySelector('#controlset_signal').innerHTML = 'Lost signal signalRegisterId：' + signalList.join(',')
                      res.controlSets[p].signalList = []
                    }
                  } else {
                    res.controlSets[p].signalList = []
                  }
                }
                // 处理异常导入情况
                if (res.controlSets && res.controlSets.length === 0) res.controlSets = [JSON.parse(createReport)]

                this.config.controlSets = res.controlSets
                this.handleReportSignal()
                this.disabledSignal()
              })
            } else {
              console.log('has been delete' + baseListId)
            }
          }
        }
      }
    },
    filterMethod(query, item) {
      return item.pinyin.indexOf(query) > -1
    },
    readFile(file) {
      const name = file[0].name
      if (/\.json$/.test(name) === false) {
        this.$refs.file.value = ''
        return this.$message.warning('Must be a json file')
      }

      if (file && file.length) {
        const fr = new FileReader()
        fr.readAsText(file[0], 'utf-8')
        fr.onload = () => {
          try {
            const config = JSON.parse(fr.result)
            config.configId = null
            this.setDetail(config)
            this.dialogComment = false
            this.$refs.file.value = ''
          } catch (err) {
            this.$refs.file.value = ''
            this.$message.warning('Configuration file format error')
          }
        }
      }
    },
    triggerCheckName() {
      // isRepeatValue(this.triggerList, 'triggerName')
      if (isRepeat(this.config.triggerList, 'triggerName')) return this.message('Trigger Name cannot be duplicate')

      for (let i = 0; i < this.config.triggerList.length; i++) {
        if (this.config.triggerList[i].eventType === 'evaluate') {
          this.config.triggerList[i].__triggerList = JSON.parse(JSON.stringify(this.triggerList))
        }
      }
    },
    changeEventType(v) {
      if (v.eventType === 'compare') delete v.__triggerList
      const arr = []
      // 处理 compare
      for (let i = 0; i < this.config.triggerList.length; i++) {
        if (this.config.triggerList[i].eventType === 'compare') {
          this.config.triggerList[i].disabled = false
          arr.push(this.config.triggerList[i])
        }
      }

      // 处理 evaluate
      for (let i = 0; i < this.config.triggerList.length; i++) {
        if (this.config.triggerList[i].eventType === 'evaluate') {
          // const triggerList = this.config.triggerList[i].__triggerList
          // if (triggerList && triggerList.length) {
            // const __triggerList = []
            // for (let n = 0; n < triggerList.length; n++) {
            //   if (triggerList[n]._id !== v._id) {
            //     __triggerList.push(triggerList[n])
            //   }
            // }
            // update compare trigger list
            // this.config.triggerList[i].__triggerList = __triggerList
          // }
          this.config.triggerList[i].__triggerList = JSON.parse(JSON.stringify(arr))
          const __compareList = this.config.triggerList[i].compareTriggerList
          if (__compareList && __compareList.length) {
            // remove current trigger
            const __triggerList = []
            for (let n = 0; n < __compareList.length; n++) {
              if (__compareList[n]._id !== v._id) {
                __triggerList.push(__compareList[n])
                for (let m = 0; m < this.config.triggerList[i].__triggerList.length; m++) {
                  if (__compareList[n]._id === this.config.triggerList[i].__triggerList[m]._id) {
                    this.config.triggerList[i].__triggerList[m].disabled = true
                  }
                }
              }
            }
            this.config.triggerList[i].compareTriggerList = __triggerList
          }
        }
      }

      this.triggerList = arr
      // this.computerEventType('change')
    },
    dragJSON(el) {
      el.addEventListener('dragover', (e) => {
        lock(e)
        el.classList.add('active')
      })
      el.addEventListener('dragenter', (e) => {
        lock(e)
        el.classList.add('active')
      })
      el.addEventListener('drop', (e) => {
        lock(e)
        el.classList.remove('active')
        this.readFile(e.dataTransfer.files)
      })
    },
    importConf(e) {
      this.readFile(e.target.files)
    },
    changeTrigger(v) {
      const id = []
      for (let i = 0; i < v.compareTriggerList.length; i++) {
        id.push(v.compareTriggerList[i]._id)
      }

      for (let i = 0; i < v.__triggerList.length; i++) {
        if (id.indexOf(v.__triggerList[i]._id) >= 0) {
          v.__triggerList[i].disabled = true
        } else {
          v.__triggerList[i].disabled = false
        }
      }

      // const list = []
      // for (let i = 0; i < arr.length; i++) {
      //   list.push(arr[i]._id)
      // }
      // for (let i = 0; i < this.triggerList.length; i++) {
      //   if (list.indexOf(this.triggerList[i]._id) >= 0) {
      //     this.triggerList[i].disabled = true
      //   } else {
      //     this.triggerList[i].disabled = false
      //   }
      // }
    },
    changeBtn(t, v, a) {
      // let configFrequency = this.config.configFrequency || 60
      // if (this.config.unit === 'minute') configFrequency = configFrequency * 60
      // const __createReport = JSON.parse(createReport)
      // __createReport.configFrequency = configFrequency
      if (t === 'batch') {
        selection.init(signal_base.list, signal_selected.list)
      } else if (t === 'delete') {
        if (signal_selected.status === 'signal') return signal_selected.fn()
        if (data.cache.dialogStatus === 'controlset') this.changeBtn('controlSetDel')
        if (data.cache.dialogStatus === 'trigger') this.changeBtn('triggerDel')
      } else if (t === 'frequency') {
        if (v.triggerTypeName === 'By Time Interval') {
          let configFrequency = this.config.configFrequency || 60
          if (this.config.unit === 'minute') configFrequency = configFrequency * 60
          v.configFrequency = configFrequency
        } else if (v.triggerTypeName === 'By Trigger') {
          v.configFrequency = null
        }
      } else if (t === 'triggerDelCheck') {
        this.computerEventType('close', v)
      } else if (t === 'triggerDelOpen') {
        this.dialogDelete = true
        this.dialogContent = data.titleDel + ' ' + v.triggerName
        data.cache.commonActive = v
        data.cache.dialogStatus = 'trigger'
      } else if (t === 'triggerDel') {
        const i = this.config.triggerList.indexOf(data.cache.commonActive)
        if (i >= 0) {
          let n = 0
          let id = ''
          for (; n < this.triggerList.length; n++) {
            if (this.triggerList[n]._id === data.cache.commonActive._id) {
              id = data.cache.commonActive._id
              break
            }
          }
          if (id) {
            const list = this.config.triggerList
            for (let l = 0; l < list.length; l++) {
              if (list[l].eventType === 'evaluate') {
                const __list = list[l].compareTriggerList
                const __arr = []
                for (let m = 0; m < __list.length; m++) {
                  if (__list[m]._id !== id) {
                    __arr.push(__list[m])
                  }
                }
                list[l].compareTriggerList = __arr
                if (list[l].compareTriggerList.length === 0) list[l].compareTriggerList.push({})
              }
            }
          }
          if (n >= 0) this.triggerList.splice(n, 1)
          this.config.triggerList.splice(i, 1)

          // update report
          if (this.config.controlSets.length) {
            for (let i = 0; i < this.config.controlSets.length; i++) {
              if (this.config.controlSets[i].triggerTypeName === 'By Trigger') {
                if (this.config.controlSets[i].triggerList === data.cache.commonActive.triggerName) {
                  this.config.controlSets[i].triggerList = ''
                }
              }
            }
          }
        }
        this.dialogDelete = false
        data.cache.commonActive = ''
      } else if (t === 'controlSetDelOpen') {
        this.dialogDelete = true
        this.dialogContent = data.titleDel
        this.dialogTitle = 'Delete controlSet'
        data.cache.commonActive = v
        data.cache.dialogStatus = 'controlset'
      } else if (t === 'controlSetDel') {
        const i = this.config.controlSets.indexOf(data.cache.commonActive)
        if (i >= 0) this.config.controlSets.splice(i, 1)
        this.dialogDelete = false
        data.cache.commonActive = ''
      } else if (t === 'baseList') {
        this.getSignalDetail()
      } else if (t === 'signalAdd') {
        // console.log(this.config.signals.length, signal_base.list.length)
        if (this.config.signals.length >= signal_base.list.length) return this.$message({ type: 'warning', message: 'The signal has reached the upper limit' })
        this.config.signals.unshift({ __lBaseListLogicalValueList: [], __lBaseListPhysicalValueList: [] })
        signal_selected.addSignal()
      } else if (t === 'save') {
        this.buildConf(1, v)
      } else if (t === 'submit') {
        this.buildConf(7, v)
      } else if (t === 'viewDetail') {
        this.dialogDetail = true
        this.lBaseListLogicalValueList = v.__lBaseListLogicalValueList.length ? v.__lBaseListLogicalValueList : []
        this.lBaseListPhysicalValueList = v.__lBaseListPhysicalValueList.length ? v.__lBaseListPhysicalValueList : []
      } else if (t === 'cancel') {
        const status = this.$route.query.status || '1'
        this.$router.replace({ name: 'configDashboard', query: { status }})
      } else if (t === 'addControlSet') {
        // if (this.controlSets.length >= data.controlSetMaxNumber) {
        //   this.$message('Cannot add more, please modify the base information!')
        // }
        if (this.config.controlSets.length >= 32) return this.message('Create up to 32 reports')
        const params = JSON.parse(createReport)
        params.key = Date.now()
        this.handleReportSignal(params)
        this.config.controlSets.unshift(params)
      } else if (t === 'triggerAdd') {
        if (this.config.triggerList.length >= 10) return this.$message('The trigger count has to be less than 10')
        const n = Math.floor(Math.random() * 100)
        const en = generateMixed(2)
        this.config.triggerList.unshift({ _id: 'o_' + en + n, triggerName: 'test_' + this.config.triggerList.length, compareTriggerList: [{}], eventType: null, signal: null, triggerValue: null, description: null, disabled: false, __triggerList: [] })
        this.$nextTick(() => {
          this.computerEventType('add')
        })
      } else if (t === 'viewComment') {
        this.dialogComment = true
        this.dialogContent = v.signalComment
      } else if (t === 'forward') {
        const n = a.indexOf(v)
        n === 0 ? toolMove.bottom(n, a) : toolMove.move(a, n)
      } else if (t === 'backward') {
        const n = a.indexOf(v)
        n === a.length - 1 ? toolMove.top(n, a) : toolMove.move(a, n, n + 1)
      } else if (t === 'delEvaluate') {
        const i = a.compareTriggerList.indexOf(v)
        if (i >= 0) a.compareTriggerList.splice(i, 1)
        for (let n = 0; n < a.__triggerList.length; n++) {
          if (a.__triggerList[n]._id === v._id) {
            a.__triggerList[n].disabled = false
          }
        }
      } else if (t === 'addEvaluate') {
        // v.compareTriggerList.push({})
        if (v.compareTriggerList.length < this.triggerList.length) v.compareTriggerList.push({})
      } else if (t === 'focus') {
        this.$nextTick(() => this.computerEventType('focus', v))
      } else if (t === 'import') {
        this.showDialogImport()
      } else if (t === 'sort') {
        // this.sortTrigger()
      } else if (t === 'triggerSignal') {
        v.triggerValue = ''
        if (this.config.signals && this.config.signals.length) {
          for (let i = 0; i < this.config.signals.length; i++) {
            if (this.config.signals[i].signalRegisterId === v.registerId) {
              v.signal = JSON.parse(JSON.stringify(this.config.signals[i]))
            }
          }

          if (v.signal && v.signal.__lBaseListPhysicalValueList && v.signal.__lBaseListPhysicalValueList.length) {
            v.description = v.signal.__lBaseListPhysicalValueList[0].pvUnit
            // lBaseListPhysicalValueList 物理值
            // {
            //   pvId: 76
            //   pvListId: 76
            //   pvMaximumValue: "65532"
            //   pvMinimumValue: "0"
            //   pvOffset: "0"
            //   pvPhysicalValue: "0 .. 491.49"
            //   pvRegisterId: "101"
            //   pvScale: "0.0075"
            //   pvUnit: "Unit_KiloMeterPerHour"
            // }
          }
          // else if (v.signal.__lBaseListLogicalValueList && v.signal.__lBaseListLogicalValueList.length) {
          // lBaseListLogicalValueList  逻辑值
          // {
          //   lvDescription: "Unterspannung"
          //   lvId: 268
          //   lvListId: 76
          //   lvOriginalValue: 65533
          //   lvRegisterId: "101"
          // }
          // }

          this.disabledSignal()
        }
      } else if (t === 'physical') {
        if (v.signal.__lBaseListLogicalValueList && v.signal.__lBaseListLogicalValueList.length) {
          clearTimeout(data.cache.time)
          data.cache.time = setTimeout(() => {
            data.cache.state = false
            for (let i = 0; i < v.signal.__lBaseListLogicalValueList.length; i++) {
              if (v.signal.__lBaseListLogicalValueList[i].lvOriginalValue + '' === v.triggerValue) {
                data.cache.state = true
                v.description = v.signal.__lBaseListLogicalValueList[i].lvDescription
                break
              }
            }
            if (data.cache.state === false && v.signal.__lBaseListPhysicalValueList && v.signal.__lBaseListPhysicalValueList.length) {
              v.description = v.signal.__lBaseListPhysicalValueList[0].pvUnit
            }
            // 判断最大值是否超出范围, 在 rule 里 check
          }, 100)
        }
      } else if (t === 'logical') {
        if (v.signal.__lBaseListLogicalValueList && v.signal.__lBaseListLogicalValueList.length) {
          for (let i = 0; i < v.signal.__lBaseListLogicalValueList.length; i++) {
            if (v.triggerValue === v.signal.__lBaseListLogicalValueList[i].lvOriginalValue) {
              v.description = v.signal.__lBaseListLogicalValueList[i].lvDescription
              break
            }
          }
        }
      }
    },
    disabledSignal() {
      const triggerList = this.config.triggerList
      if (!triggerList || triggerList.length === 0) return
      const arr = []
      for (let i = 0; i < triggerList.length; i++) {
        if (triggerList[i].eventType === 'compare' && triggerList[i].signal) {
          if (triggerList[i].signal.signalRegisterId) arr.push(triggerList[i].signal.signalRegisterId)
        }
      }
      if (arr.length) {
        const list = document.querySelectorAll('#signal_selected_tbody input')
        for (let i = 0; i < list.length; i++) {
          if (arr.indexOf(list[i].dataset.id) >= 0) {
            list[i].classList.add('disabled')
          } else {
            list[i].classList.remove('disabled')
          }
        }
      }
    },
    computerEventType(v, o) {
      const count = { compare: 0, evaluate: 0 }
      for (let i = 0; i < this.config.triggerList.length; i++) {
        const event = this.config.triggerList[i].eventType
        if (event === 'compare') count.compare += 1
        if (event === 'evaluate') count.evaluate += 1
      }

      // update el total
      const compare = document.querySelector('#compare')
      const evaluate = document.querySelector('#evaluate')
      if (compare) compare.innerHTML = count.compare
      if (evaluate) evaluate.innerHTML = count.evaluate
      if (this.$refs.eventType) this.$refs.eventType.innerHTML = this.config.triggerList.length - (count.compare + count.evaluate)

      if (v === 'add') {
        const evaluate = Math.floor(count.compare / 2)
        console.log('列表个数:' + this.config.triggerList.length)
        console.log('evaluate当前拥有:' + count.evaluate, '可以拥有:' + evaluate)
        if (count.evaluate < evaluate) {
          this.eventTypeList[1].__disabled = false
        } else {
          this.eventTypeList[1].__disabled = true
        }
      } else if (v === 'close') {
        // console.log('当前compare数量:' + count.compare, '必须数量' + count.evaluate * 2)
        if (o.eventType === 'compare') {
          if (count.compare > count.evaluate * 2) {
            this.changeBtn('triggerDelOpen', o)
          } else {
            this.message('The trigger is being selected in reports, cannot be deleted')
          }
        } else {
          this.changeBtn('triggerDelOpen', o)
        }
      } else if (v === 'focus') {
        if (o.eventType === 'compare') {
          if (Math.floor((count.compare - 1) / 2) > count.evaluate) {
            this.eventTypeList[1].__disabled = false
          } else {
            this.eventTypeList[1].__disabled = true
          }
        } else if (o.eventType === null) {
          if (Math.floor(count.compare / 2) > count.evaluate) {
            this.eventTypeList[1].__disabled = false
          } else {
            this.eventTypeList[1].__disabled = true
          }
        }
      }
    },
    message(message) { this.$message({ type: 'warning', showClose: true, duration: 4000, message }) },
    submitConfig() {
      data.cache.dialog = false
      this.buildConf(data.cache.dialogStatus)
    },
    cancelConfig() {
      data.cache.dialog = true
      this.dialogStatus = false
    },
    async buildConf(status, event) {
      // report 最多32 未拦截
      data.cache.dialogStatus = status

      // trigger list
      for (let i = 0; i < this.config.triggerList.length; i++) {
        if (this.config.triggerList[i].eventType === 'evaluate') {
          if (this.config.triggerList[i].compareTriggerList.length <= 1) return this.message('In one "evaluate" trigger, the number of "compare" trigger must be >=2')
          for (let n = 0; n < this.config.triggerList[i].compareTriggerList.length; n++) {
            if (!this.config.triggerList[i].compareTriggerList[n]._id) return this.message('Please select trigger')
          }
        }
      }

      let n = 0
      if (this.$refs.trigger) {
        for (let i = 0; i < this.$refs.trigger.length; i++) {
          this.$refs.trigger[i].validate((valid) => {
            if (!valid) n += 1
          })
        }
      }
      if (n) return console.log('three error')

      // if (three === false) return this.message('Please fill in the third part of the data')
      this.$refs.base.validate((valid) => {
        if (!valid) return false
        const conf = JSON.parse(JSON.stringify(this.config))

        // info
        conf.configFrequency = this.changeUnit()
        if (conf.configFrequency >= 600 && data.cache.dialog) {
          this.dialogStatus = true // 超过 10 分钟
          return
        }

        if (conf.configId === null) delete conf.configId
        if (conf.configId === null) conf.configId = parseInt(conf.configId)
        if (conf.configDataSets) conf.configDataSets = parseInt(conf.configDataSets)

        // signal
        // if (conf.signals) return console.log(conf.signals)
        if (conf.signals && conf.signals.length) {
          for (let i = 0; i < conf.signals.length; i++) {
            //
            if (conf.signals[i].__lBaseListLogicalValueList) delete conf.signals[i].__lBaseListLogicalValueList
            if (conf.signals[i].__lBaseListPhysicalValueList) delete conf.signals[i].__lBaseListPhysicalValueList
          }
          const __arr = []
          for (let n = 0; n < conf.signals.length; n++) {
            if (Object.keys(conf.signals[n]).length >= 1) {
              __arr.push(conf.signals[n])
            }
          }
          conf.signals = __arr
        }

        // triggerList
        if (conf.triggerList && conf.triggerList.length) {
          // check triggerName 重名
          if (isRepeat(conf.triggerList, 'triggerName')) return this.message('Trigger Name cannot be duplicate')

          const evaluateTriggers = []
          const compareTriggers = []
          for (let i = 0; i < conf.triggerList.length; i++) {
            delete conf.triggerList[i].signalScaling
            delete conf.triggerList[i].signalOffset

            if (conf.triggerList[i].eventType === 'evaluate') {
              evaluateTriggers.push(conf.triggerList[i])
            } else if (conf.triggerList[i].eventType === 'compare') {
              compareTriggers.push(conf.triggerList[i])
            }
          }

          // evaluateTriggers
          if (evaluateTriggers.length) {
            for (let i = 0; i < evaluateTriggers.length; i++) {
              const list = evaluateTriggers[i].compareTriggerList

              if (list && list.length) {
                const arr = []
                for (let n = 0; n < list.length; n++) {
                  // delete list[n].signalScaling
                  // delete list[n].signalOffset
                  const _id = list[n]._id
                  for (let s = 0; s < compareTriggers.length; s++) {
                    if (compareTriggers[s]._id === _id) {
                      arr.push(compareTriggers[s].triggerName)
                    }
                  }
                }
                evaluateTriggers[i].compareTriggerList = arr
              }
              // delete evaluateTriggers[i]._id
              delete evaluateTriggers[i].signal
              delete evaluateTriggers[i].triggerValue
              delete evaluateTriggers[i].description

              const compareTriggerDtoList = evaluateTriggers[i].compareTriggerDtoList
              if (compareTriggerDtoList && compareTriggerDtoList.length) {
                for (let l = 0; l < compareTriggerDtoList.length; l++) {
                  console.log(compareTriggerDtoList[l])
                  delete compareTriggerDtoList[l].signalOffset
                  delete compareTriggerDtoList[l].signalScaling
                }
              }
            }
          }
          conf.evaluateTriggers = evaluateTriggers

          // compareTriggers
          if (compareTriggers.length) {
            for (let i = 0; i < compareTriggers.length; i++) {
              compareTriggers[i].signalName = compareTriggers[i].signal.signalName
              delete compareTriggers[i]._id
              delete compareTriggers[i].signal
              delete compareTriggers[i].compareTriggerList
            }
          }
          conf.compareTriggers = compareTriggers
        }

        // controlSet
        if (conf.controlSets && conf.controlSets.length) {
          for (let i = 0; i < conf.controlSets.length; i++) {
            if (conf.controlSets[i].triggerTypeName === 'By Trigger') {
              if (!conf.controlSets[i].triggerList || conf.controlSets[i].triggerList.length === 0) return this.$message({ type: 'warning', message: 'Report trigger cannot be empty' })
            }
          }

          for (let i = 0; i < conf.controlSets.length; i++) {
            if (conf.controlSets[i].triggerList && conf.controlSets[i].triggerList.length) {
              conf.controlSets[i].triggerList = [conf.controlSets[i].triggerList]
            } else {
              delete conf.controlSets[i].triggerList
            }
            delete conf.controlSets[i].__signalList
            delete conf.controlSets[i].key
          }

          for (let i = 0; i < conf.controlSets.length; i++) {
            // filter privacyMode
            const privacyName = conf.controlSets[i].privacyMode
            for (let n = 0; n < this.privacyList.length; n++) {
              if (this.privacyList[n].privacyName === privacyName) {
                conf.controlSets[i].privacyMode = this.privacyList[n].privacyCode
              }
            }
          }
          for (let i = 0; i < conf.controlSets.length; i++) {
            if (conf.controlSets[i].controlSetName === undefined || conf.controlSets[i].controlSetName === '') return this.$message('The Data Package Name cannot be empty.')
            if (conf.controlSets[i].signalList.length === 0) return this.$message('Please select signal')
            if (conf.controlSets[i].triggerTypeName === 'By Time Interval' && !conf.controlSets[i].configFrequency) return this.$message('Please Enter Package Time Interval')
            // if (conf.controlSets[i].triggerTypeName === 'By Trigger' && conf.controlSets[i].triggerList === undefined) return this.$message('Please select one trigger.')
            // if (conf.controlSets[i].triggerTypeName === 'By Trigger' && conf.controlSets[i].triggerList.length === 0) return this.$message('Please select one trigger.')
            // console.log(conf.controlSets[i].triggerTypeName, conf.controlSets[i].triggerList)
          }
        } else {
          return this.$message('Please create a report')
        }

        // delete bId
        delete conf.baseListId
        delete conf.triggerList
        delete conf.appId
        delete conf.unit

        for (let i = 0; i < this.consentList.length; i++) {
          if (this.consentList[i].consentId === conf.consentId) {
            conf.appId = this.consentList[i].appId
            break
          }
        }

        if (!conf.appId) return this.$message({ type: 'warning', message: 'Missing parameter appid.' })
        // if (conf) return console.log(JSON.stringify(conf)) // to do
        if (event && event.target.classList.contains('disabled')) return

        this.setLoading()
        if (event) event.target.classList.add('disabled')

        base.create(conf).then((res) => {
          if (event) event.target.classList.remove('disabled')
          this.setLoading('close')
          if (this.dialogStatus) this.dialogStatus = false
          const id = res
          if (id) this.$message({ type: 'success', message: 'successfully' })
          data.cache.dialog = true
          if (conf.configId) {
            dashboard.update({
              configId: conf.configId,
              flowStatus: status
            }).then((result) => {
              console.log(result)
              if (result) return this.$router.push({ name: 'configDashboard', query: { status }})
            })
          } else {
            if (id) {
              dashboard.update({
                configId: id,
                flowStatus: status
              }).then((result) => {
                // console.log(result)
                if (result) return this.$router.push({ name: 'configDashboard', query: { status }})
              })
            }
            if (status === 1) return this.$router.push({ name: 'configDashboard', query: { status: 1 }})
          }
        }).catch(() => {
          if (event) event.target.classList.remove('disabled')
          if (this.dialogStatus) this.dialogStatus = false
          this.setLoading('close')
        })
      })
    },
    setSignal(data) {
      const res = JSON.parse(JSON.stringify(data))
      for (let i = 0; i < signal_base.list.length; i++) {
        const signal = signal_base.list[i]
        for (let n = 0; n < res.length; n++) {
          if (res[n].signalRegisterId === signal.lRegisterId) {
            res[n].baseListId = signal.lBListId
            res[n].signalComment = signal.lDescription
            res[n].signalGeoRelated = signal.lIsGeo
            res[n].signalLength = signal.lSignalLength || 0
            res[n].signalName = signal.lSignalName
            res[n].signalRegisterId = signal.lRegisterId
            res[n].__lBaseListLogicalValueList = signal.lBaseListLogicalValueList
            res[n].__lBaseListPhysicalValueList = signal.lBaseListPhysicalValueList
          }
        }
      }
      signal_selected.list = res
      signal_selected.setSignal()

      this.config.signals = []
      this.config.signals = res
      this.checkTriggerSignal()
      // this.handleReportSignal()
    },
    checkTriggerSignal() {
      // 遍历 trigger 里的 signal 是否存在
      const trigger = this.config.triggerList

      if (trigger && trigger.length) {
        // 收集 signalRegisterId
        const arr = []
        if (this.config.signals && this.config.signals.length) {
          for (let i = 0; i < this.config.signals.length; i++) {
            arr.push(this.config.signals[i].signalRegisterId)
          }
        }

        for (let i = 0; i < trigger.length; i++) {
          const registerId = trigger[i].registerId
          // 判断是否cun'zai
          if (registerId) {
            const n = arr.indexOf(registerId)
            if (n <= -1) {
              trigger[i].signal = null
              trigger[i].triggerValue = null
              trigger[i].description = null
              trigger[i].registerId = null
            } else {
              // signal change的时候不太可能走这里
              trigger[i].signal = this.config.signals[n] // object
              if (trigger[i].triggerValue === null) {
                // 不存在所以赋默认值
                if (trigger[i].signal.__lBaseListPhysicalValueList && trigger[i].signal.__lBaseListPhysicalValueList.length) {
                  trigger[i].signal.description = trigger[i].signal.__lBaseListPhysicalValueList[0].pvUnit
                }
              } else {
                const triggerValue = parseInt(trigger[i].triggerValue) // string to number
                const log = trigger[i].signal.__lBaseListLogicalValueList
                trigger[i].triggerValue = triggerValue
                if (log && log.length) {
                  for (let n = 0; n < log.length; n++) {
                    // value 匹配逻辑值
                    if (log[n].lvOriginalValue.toString() === triggerValue.toString()) {
                      trigger[i].description = log[n].lvDescription
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    showDialogImport() {
      this.commonWidth = '50%'
      this.dialogTitle = 'Import Configuration File'
      this.dialogComment = true
      this.dialogContent = ''
      this.$nextTick(() => {
        this.dragJSON(document.querySelector('#drag'))
      })
    },
    changeUnit() {
      let n = 0
      const v = this.config.unit
      if (v === 'minute') {
        n = this.config.configFrequency * 60
      } else if (v === 'hours') {
        n = this.config.configFrequency * 60 * 60
      } else if (v === 'second') {
        n = this.config.configFrequency
      }

      return n
      // n = Math.floor(n / 20)
      // data.controlSetMaxNumber = n
      // this.setTotal('#controlSetTotal', n)
    },
    // setTotal(v, n) { document.querySelector(v).innerHTML = n },
    resetForm(v) { this.$refs[v].resetFields() },
    checkForm(v, cb) {
       this.$refs[v].validate((result) => {
        if (result) return cb()
        console.log('error submit!!')
        return false
      })
    },
    getSignalDetail(data, cb) {
      this.setLoading()
      // const list = window.localStorage.getItem('signal_' + this.config.baseListId) // local
      // if (list) {
        // signal_base.list = JSON.parse(list)
        // signal_base.toData()
        // signal_base.init()
        // signal_selected.init()
        // signal_base.setTotal()
        // this.config.signals = []
        // if (this.config.triggerList && this.config.triggerList.length) {
        //   for (let i = 0; i < this.config.triggerList.length; i++) {
        //     this.config.triggerList[i].registerId = ''
        //     this.config.triggerList[i].triggerValue = ''
        //     this.config.triggerList[i].signal = ''
        //     this.config.triggerList[i].description = ''
        //   }
        // }
        // this.handleReportSignal()
        // this.setLoading('close')
        // cb && cb()
      // } else {
      base.detail({ baseId: this.config.baseListId }).then((res) => {
        if (res) {
          const arr = []
          for (let i = 0; i < res.length; i++) {
            arr.push(res[i].lRegisterId)
            res[i].__value = res[i].lSignalName + res[i].lRegisterId
          }

          if (this.type === 'import' && data && data.signals && data.signals.length) {
            // 导入的信号不存在于信号列表里，手动过滤
            const __signal = []
            for (let n = 0; n < data.signals.length; n++) {
              if (arr.indexOf(data.signals[n].signalRegisterId) >= 0) {
                __signal.push(data.signals[n])
              } else {
                console.log('过滤的信号', data.signals[n].signalRegisterId)
              }
            }
            data.signals = __signal
          }

          // window.localStorage.setItem('signal_' + this.config.baseListId, JSON.stringify(res)) // local
          signal_base.list = res
          signal_base.toData()
          signal_base.init()
          signal_selected.init()
          signal_base.setTotal()
        }
        this.config.signals = []
        if (this.config.triggerList && this.config.triggerList.length) {
          for (let i = 0; i < this.config.triggerList.length; i++) {
            this.config.triggerList[i].registerId = ''
            this.config.triggerList[i].triggerValue = ''
            this.config.triggerList[i].signal = ''
            this.config.triggerList[i].description = ''
          }
        }
        this.handleReportSignal()
        this.setLoading('close') // 清除report的信号数据
        cb && cb()
      }).catch(() => {
        this.setLoading('close')
      })
      // }
    },
    toggleMain(v) {
      const el = document.querySelector(v)
      el.style.display = (!el.style.display || el.style.display === 'block') ? 'none' : 'block'
    },
    changeRadio(t, v) {
      const arr = []
      if (t === 'register') {
        if (v.registerList.length !== this.registerList.length) {
          for (let i = 0; i < this.registerList.length; i++) {
            arr.push(this.registerList[i].operationCode)
          }
        }
        v.registerList = arr
      } else if (t === 'signal') {
        if (v.__signalList.length !== v.signalList.length) {
          for (let i = 0; i < v.__signalList.length; i++) arr.push(v.__signalList[i].signalRegisterId)
        }
        v.signalList = arr
      }
    },
    __setSignal(list) {
      if (list && list.length) {
        const arr = []
        for (let i = 0; i < list.length; i++) {
          const obj = {
            signalName: list[i].lSignalName,
            signalLength: list[i].lSignalLength || 0,
            signalRegisterId: list[i].lRegisterId,
            baseListId: list[i].lBListId,
            signalComment: list[i].lDescription,
            signalGeoRelated: list[i].lIsGeo,
            __lBaseListLogicalValueList: list[i].lBaseListLogicalValueList,
            __lBaseListPhysicalValueList: list[i].lBaseListPhysicalValueList
          }
          arr.push(obj)
        }
        signal_selected.list = arr
        signal_selected.setSignal()

        this.config.signals = []
        this.config.signals = arr

        this.checkTriggerSignal()
        this.handleReportSignal()
        this.disabledSignal()
      } else {
        signal_selected.reset()
        this.config.signals = []

        // 信号=0 > 清空 report
        for (let i = 0; i < this.config.controlSets.length; i++) {
          this.config.controlSets[i].signalList = []
          this.config.controlSets[i].__signalList = []
        }

        // 判断 trigger 是否有已选信号
        const list = this.config.triggerList
        if (list && list.length) {
          let arr = []
          for (let i = 0; i < list.length; i++) {
            if (list[i].eventType === 'compare' && list[i].signal && list[i].signal.signalName) {
              if (list[i].signal) arr.push(list[i].signal) // 已选信号不能删除
            }
          }
          if (arr.length === 0) {
            this.changeBtn('signalAdd')
          } else {
            arr = handle(arr, 'signalName')
            signal_selected.list = arr // signalNameke 可能重复
            signal_selected.setSignal()

            this.config.signals = []
            this.config.signals = arr

            this.checkTriggerSignal()
            this.handleReportSignal()
            // 更新已选 更细 signal
            this.message('Cannot delete signals that have already been used')
            this.disabledSignal()
          }
        } else {
          this.changeBtn('signalAdd')
        }
      }
    },
    // sortTrigger() {
    //   const compare = []
    //   const evaluate = []
    //   for (let i = 0; i < this.config.triggerList.length; i++) {
    //     if (this.config.triggerList[i].eventType === 'compare') {
    //       compare.push(this.config.triggerList[i])
    //     } else {
    //       evaluate.push(this.config.triggerList[i])
    //     }
    //   }
    //   this.config.triggerList = compare.concat(evaluate)
    //   // this.config.triggerList = evaluate.concat(compare)
    // },
    handleReportSignal(v) {
      if (v) {
        // create entry
        const arr = []
        if (this.config.signals.length) {
          for (let i = 0; i < this.config.signals.length; i++) {
            const signalName = this.config.signals[i].signalName
            if (v.privacyMode === 'GEO DATA' && signalName) {
              if (signalName.toLowerCase().indexOf('gns') >= 0) arr.push(this.config.signals[i])
            } else if (v.privacyMode === 'NON GEO DATA' && signalName) {
              if (signalName.toLowerCase().indexOf('gns') <= -1) arr.push(this.config.signals[i])
            } else if (v.privacyMode === 'ON' || v.privacyMode === 'OFF') {
              arr.push(this.config.signals[i])
            }
            // arr.push(this.config.signals[i])
          }
          v.signalList = []
        }
        v.__signalList = arr
      } else {
        if (this.config.signals && this.config.signals.length) {
          const __list = JSON.parse(JSON.stringify(this.config.controlSets)) // to do

          for (let i = 0; i < __list.length; i++) {
            const arr = []
            const privacyName = this.config.controlSets[i].privacyMode
            const registerId_all = []

            for (let n = 0; n < this.config.signals.length; n++) {
              // 分离 geo 信号数据
              const signalName = this.config.signals[n].signalName
              if (privacyName === 'GEO DATA' && signalName) {
                if (signalName.toLowerCase().indexOf('gns') >= 0) arr.push(this.config.signals[n])
              } else if (privacyName === 'NON GEO DATA' && signalName) {
                if (signalName.toLowerCase().indexOf('gns') <= -1) arr.push(this.config.signals[n])
              } else if (privacyName === 'ON' || privacyName === 'OFF') {
                arr.push(this.config.signals[n])
              }
              // 不分离 geo 信号数据
              // arr.push(this.config.signals[n])
              registerId_all.push(this.config.signals[n].signalRegisterId)
            }
            __list[i].__signalList = arr

            // 处理信号导入和批量操作的的误差
            if (__list[i].signalList && __list[i].signalList.length) {
              const __existSignal = []
              for (let m = 0; m < __list[i].signalList.length; m++) {
                if (registerId_all.indexOf(__list[i].signalList[m]) >= 0) {
                  __existSignal.push(__list[i].signalList[m])
                }
              }
              __list[i].signalList = __existSignal
            }
          }
          this.config.controlSets = []
          this.config.controlSets = __list
        } else {
          console.log('clear signallist')
          for (let i = 0; i < this.config.controlSets.length; i++) {
            this.config.controlSets[i].signalList = []
            this.config.controlSets[i].__signalList = []
          }
        }
      }
    },
    changeFrequency() {
      delay(() => {
        if (this.config.controlSets.length && this.config.configFrequency) {
          let v = this.config.configFrequency
          if (this.config.unit === 'minute') v = v * 60
          for (let i = 0; i < this.config.controlSets.length; i++) {
            if (this.config.controlSets[i].triggerTypeName === 'By Time Interval') {
              this.config.controlSets[i].configFrequency = v
            } else {
              this.config.controlSets[i].configFrequency = null
            }
          }
        }
      }, 500)
    },
    changeTime(v) {
      v.configFrequency = v.configFrequency.replace(/[^0-9]/g, '');

      if (v.triggerTypeName === 'By Time Interval') {
        // delay(() => {
        const configFrequency = this.changeUnit()
        if (v.configFrequency === '0') v.configFrequency = 1
        let controlSetFrequency = v.configFrequency.replace(/\D/g, '')
        // console.log(controlSetFrequency, configFrequency)

        if (parseInt(controlSetFrequency) > parseInt(configFrequency)) {
          v.configFrequency = configFrequency
          return this.$message({ type: 'warning', message: 'Create Report Time Interval <= ' + configFrequency + '.' })
        }
        if (controlSetFrequency.indexOf('-') >= 0) controlSetFrequency = Math.abs(controlSetFrequency) + ''
        if (controlSetFrequency.indexOf('.') >= 0) controlSetFrequency = parseInt(controlSetFrequency)
        v.configFrequency = controlSetFrequency
        // }, 500)
      }
    },
    setLoading(v) {
      if (v) {
        data.cache.loading.close()
      } else {
        data.cache.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading'
        })
      }
    },
    externalEvent(index, cb) {
      const list = this.config.triggerList
      const obj = list[index]
      if (obj && obj.signal && obj.signal.__lBaseListPhysicalValueList) {
        if (obj.signal.__lBaseListPhysicalValueList[0]) {
          const val = parseInt(obj.triggerValue)
          const str = obj.signal.__lBaseListPhysicalValueList[0].pvPhysicalValue
          let min = 0
          let max = 999999999999
          if (str) {
            const arr = str.split(' .. ')
            min = arr[0]
            max = arr[1]
            if (val < min || val > max) {
              return cb(new Error('Please enter a number between ' + min + ' and ' + max))
            }
          } else {
            if (val >= max) {
              return cb(new Error('Please do not exceed 12 digits'))
            }
          }
          // const min = obj.signal.__lBaseListPhysicalValueList[0].pvMinimumValue
          // const max = obj.signal.__lBaseListPhysicalValueList[0].pvMaximumValue
          return cb()
        }
      }
    }
  }
}
</script>
