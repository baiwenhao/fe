import signal_selected from './signal_selected'
import { lockScreen } from './utils'

const signal_base = {
  total_id: '#signal_all_total',
  __vue: null,
  list: [], // 全部信号
  list_obj: null,
  list_filter: [], // 筛选信号
  element_self: null,
  element_body: null,
  element_active: null,
  init() {
    const tpl = this.getItemTemplate(this.list)
    const template = '' +
    '<div class="el-scrollbar" style="">' +
    '  <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -15px; margin-right: -15px;">' +
    '    <ul id="signal_list_ul" class="el-scrollbar__view el-select-dropdown__list">' + tpl
    '    </ul>' +
    '  </div>' +
    '  <div class="el-scrollbar__bar is-horizontal">' +
    '    <div class="el-scrollbar__thumb"></div>' +
    '  </div>' +
    '  <div class="el-scrollbar__bar is-vertical">' +
    '    <div class="el-scrollbar__thumb"></div>' +
    '  </div>' +
    '</div>' +
    '<div class="popper__arrow" style="left: 35px;"></div>'

    this.element_self = document.querySelector('#signal_base_list')
    this.element_self.innerHTML = template
    this.element_body = this.element_self.querySelector('#signal_list_ul')
    this.element_body.addEventListener('click', this.signalClick.bind(this), false)
  },
  getItemTemplate(arr) {
    let tpl = ''
    if (arr.length === 0) {
      tpl = '<div style="padding: 12px 0" class="tac">No data</div>'
    } else {
      for (let i = 0; i < arr.length; i++) {
        tpl += '<li class="el-select-dropdown__item" data-id="' + arr[i].lRegisterId + '"><span class="fl none">' + arr[i].lSignalName + '</span><span class="fr none">' + arr[i].lRegisterId + '</span></li>'
      }
    }
    return tpl
  },
  toData() {
    this.list_obj = {}
    for (let i = 0; i < this.list.length; i++) {
      this.list_obj[this.list[i].lRegisterId] = this.list[i]
    }
  },
  signalClick(e) {
    if (!e.target.classList.contains('el-select-dropdown__item')) return
    if (e.target.classList.contains('is-disabled') || e.target.classList.contains('tac')) return lockScreen(e)

    const obj = {}
    const parent = signal_selected.element_active_signal.parentNode.parentNode
    const id = e.target.dataset.id

    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].lRegisterId === id) {
        obj.signalName = this.list[i].lSignalName
        obj.signalLength = this.list[i].lSignalLength || 0
        obj.signalRegisterId = this.list[i].lRegisterId
        obj.baseListId = this.list[i].lBListId
        obj.signalComment = this.list[i].lDescription
        obj.signalGeoRelated = this.list[i].lIsGeo
        obj.__lBaseListLogicalValueList = this.list[i].lBaseListLogicalValueList
        obj.__lBaseListPhysicalValueList = this.list[i].lBaseListPhysicalValueList
      }
    }

    // 赋值信号
    parent.querySelector('.el-input__inner').value = obj.signalName
    parent.querySelector('.el-input__inner').dataset.id = obj.signalRegisterId
    parent.querySelector('.signalLength').innerHTML = obj.signalLength
    parent.querySelector('.icon_text').innerHTML = obj.signalRegisterId
    parent.querySelector('img').dataset.id = obj.signalRegisterId
    parent.querySelector('img').dataset.name = obj.signalName
    const btns = parent.querySelectorAll('.el-button')
    btns[0].dataset.id = obj.signalRegisterId
    btns[1].dataset.id = obj.signalRegisterId
    if (obj.signalComment) btns[0].classList.remove('is-disabled')
    if (obj.__lBaseListLogicalValueList && obj.__lBaseListLogicalValueList.length || obj.__lBaseListPhysicalValueList && obj.__lBaseListPhysicalValueList.length) {
      btns[1].classList.remove('is-disabled')
    }

    // 切换操作需要更新已选信号
    const domId = []
    const list = signal_selected.element_body.querySelectorAll('.el-input__inner')
    for (let i = 0; i < list.length; i++) {
      domId.push(list[i].dataset.id)
    }
    const __signal_selected = []
    for (let i = 0; i < signal_selected.list.length; i++) {
      if (domId.indexOf(signal_selected.list[i].signalRegisterId) >= 0) {
        __signal_selected.push(signal_selected.list[i])
      }
    }
    __signal_selected.unshift(obj)
    signal_selected.list = __signal_selected
    this.__vue.config.signals = signal_selected.list
    this.__vue.handleReportSignal()

    signal_selected.element_active_signal.classList.remove('is_active')
    signal_selected.element_active_signal = null // 防止window事件
    this.element_active = e.target
    this.element_active.classList.add('is-disabled')
    this.element_self.style.display = 'none'

    // 用户输入状态
    if (signal_selected.status === 'input') {
      this.renderList()
      signal_selected.status = null
    }
    lockScreen(e)
  },
  renderList(t) {
    let tpl = ''
    if (t === 'filter') {
      tpl = this.getItemTemplate(this.list_filter)
    } else {
      tpl = this.getItemTemplate(this.list)
    }
    this.element_body.innerHTML = tpl
  },
  setTotal() {
    document.querySelector(this.total_id).innerHTML = this.list.length
  },
  reset() {
    this.list = []
    this.element_active = null
    this.element_body.innerHTML = ''
    this.element_self.display = 'none'
  }
}

export default signal_base
