import { getOffset, lockScreen, delay } from './utils'
import signal_base from './signal_base'

const signal_selected = {
  fn: function() {},
  status: '', // 字符串标识
  __vue: null, // vue 对象
  list: [], // 已选信号
  element_self: null,
  element_body: null,
  element_active_signal: null, // input
  handleEvent(e) {
    const el = e.target
    if (e.type === 'click' && el.classList.contains('el-input__inner')) {
      this.signalNameClick(el)
    } else if (e.type === 'click' && el.classList.contains('icon')) {
      this.fn = this.del(el)
    } else if (e.type === 'input') {
      this.signalNameInput(el)
    } else {
      this.winEvent()
    }
    lockScreen(e)
  },
  init() {
    this.list = []
    this.element_self = document.querySelector('#signal_list')
    this.element_self.innerHTML = this.getTemplateParent()
    this.element_body = this.element_self.querySelector('#signal_selected_tbody')
    // document.querySelector('#signal_all_total').innerHTML = 0 // window.signal_detail.length
    // document.querySelector('#signal_selected_total').innerHTML = 0
    this.element_self.addEventListener('click', this, false)
    this.element_self.addEventListener('input', this, false)
    this.updateTotalNumber()
  },
  getTemplateSignal(arr) {
    if (!arr || arr.length === 0) arr = [{ signalRegisterId: '', signalName: '' }]
    const item = []
    for (let i = 0; i < arr.length; i++) {
      item.push(
      '<tr>' +
      '  <td class="pr">' +
      '    <img data-name="' + arr[i].signalName + '" data-id="' + arr[i].signalRegisterId + '" class="icon icon_del" src="data:image/png;base64,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" />' +
      '    <input type="text" value="' + arr[i].signalName + '" data-id="' + arr[i].signalRegisterId + '" autocomplete="off" placeholder="Please select" class="el-input__inner">' +
      '    <div class="icon_text">' + arr[i].signalRegisterId + '</div>' +
      '  </td>' +
      '  <td class="tac"><span class="signalLength">' + (arr[i].signalLength || 0) + '</span></td>' +
      '  <td class="tac"><button data-id="' + arr[i].signalRegisterId + '" onclick="showSelectedComment(this)" type="button" class="el-button el-button--default el-button--mini is-disabled">View</button></td>' +
      '  <td class="tac"><button data-id="' + arr[i].signalRegisterId + '" onclick="showSelectedDetail(this)" type="button" class="el-button el-button--default el-button--mini is-disabled">View</button></td>' +
      '</tr>')
    }
    return item.join('')
  },
  getTemplateParent() {
    return '' +
    '<table class="table">' +
    '  <colgroup>' +
    '    <col /><col width="20%" /><col width="20%" /><col width="20%" />' +
    '  </colgroup>' +
    '  <thead>' +
    '    <tr>' +
    '      <th><strong class="white">*Signal Name（Register ID）</strong></th>' +
    '      <th><strong class="white">*Signal Length（Bits）</strong></th>' +
    '      <th><strong class="white">*Comment</strong></th>' +
    '      <th><strong class="white">*Detail</strong></th>' +
    '    </tr>' +
    '  </thead>' +
    '  <tbody id="signal_selected_tbody">' + this.getTemplateSignal() + '</tbody>' +
    '</table>'
  },
  setSignal() {
    if (this.list.length) this.element_body.innerHTML = this.getTemplateSignal(this.list)
    this.updateTotalNumber()
    this.dynamicIcon()
    const list = this.element_body.querySelectorAll('tr')
    for (let i = 0; i < list.length; i++) {
      const btns = list[i].querySelectorAll('.el-button')
      const obj = signal_base.list_obj[btns[0].dataset.id]
      if (obj) {
        if (obj.lDescription) btns[0].classList.remove('is-disabled')
        if (obj.lBaseListLogicalValueList && obj.lBaseListLogicalValueList.length || obj.lBaseListPhysicalValueList && obj.lBaseListPhysicalValueList.length) {
          btns[1].classList.remove('is-disabled')
        }
      }
    }
  },
  /* --- signal name event --- */
  signalNameClick(e) {
    if (e.classList.contains('is_active')) return
    const list = signal_selected.element_body.querySelectorAll('.el-input__inner')
    for (let i = 0; i < list.length; i++) {
      if (list[i].dataset.id && !list[i].value) {
        list[i].value = list[i].placeholder
        list[i].placeholder = 'Please select'
        list[i].classList.remove('is_active')
      }
    }
    e.classList.add('is_active')

    const top = getOffset(e, 'offsetTop')
    const left = getOffset(e, 'offsetLeft')
    const width = e.offsetWidth
    const height = e.offsetHeight

    signal_base.element_self.style.cssText = 'display: block;position: absolute;top: ' + (top + height) + 'px;left: ' + left + 'px;width:' + width + 'px'
    signal_selected.element_active_signal = e

    // 统一处理信号状态
    const items = signal_base.element_body.querySelectorAll('li')
    if (e.dataset.id) {
      e.placeholder = e.value
      e.value = ''
      const arr = []
      for (let i = 0; i < this.list.length; i++) {
        arr.push(this.list[i].signalRegisterId)
      }
      for (let i = 0; i < items.length; i++) {
        const id = items[i].dataset.id
        if (arr.indexOf(id) >= 0) {
          if (!items[i].classList.contains('is-disabled')) items[i].classList.add('is-disabled')
        } else {
          items[i].classList.remove('is-disabled')
        }
        if (e.dataset.id === id) {
          items[i].classList.add('selected')
        } else {
          items[i].classList.remove('selected')
        }
      }
    } else {
      const arr = []
      for (let i = 0; i < this.list.length; i++) arr.push(this.list[i].signalRegisterId)
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('selected')
        if (arr.indexOf(items[i].dataset.id) >= 0) {
          items[i].classList.add('is-disabled')
        } else {
          items[i].classList.remove('is-disabled')
        }
      }
    }
  },
  signalNameInput(e) {
    delay(() => {
      const currentId = e.dataset.id
      const value = e.value.replace(/\s/gi, '')
      // 筛选数据
      const arr = []
      for (let i = 0; i < signal_base.list.length; i++) {
        if (signal_base.list[i].__value.indexOf(value) >= 0) {
          arr.push(signal_base.list[i])
        }
      }
      // update dom
      signal_base.list_filter = arr
      signal_base.renderList('filter')

      // 添加状态
      const selected = []
      for (let i = 0; i < this.list.length; i++) {
        selected.push(this.list[i].signalRegisterId)
      }
      const list = signal_base.element_body.querySelectorAll('li')
      for (let i = 0; i < list.length; i++) {
        const id = list[i].dataset.id
        if (selected.indexOf(id) >= 0) list[i].classList.add('is-disabled')
        if (currentId && currentId === id) list[i].classList.add('selected')
      }
      this.status = 'input'
    }, 100)
  },
  dynamicIcon() {
    const list = this.element_body.querySelectorAll('tr')
    if (list.length >= 2) {
      this.element_body.classList.add('show')
    } else {
      this.element_body.classList.remove('show')
    }
  },
  del(e) {
    const id = e.dataset.id
    const parent = e.parentNode.parentNode

    if (!id) {
      this.element_body.removeChild(parent)
      this.updateTotalNumber()
      signal_base.element_self.style.display = 'none'
      this.dynamicIcon()
    } else {
      // 单个删除
      const list = this.__vue.config.triggerList
      for (let i = 0; i < list.length; i++) {
        if (list[i].signal && list[i].signal.signalName === e.dataset.name) {
          return this.__vue.message('Cannot delete signals that have already been used')
        }
      }

      // 存在的信号 弹提示框
      this.__vue.dialogDelete = true
      this.__vue.dialogContent = 'Are you sure you want to delete？' + e.dataset.name
      this.status = 'signal'

      return () => {
        this.element_body.removeChild(parent)
        const arr = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].signalRegisterId !== id) {
            arr.push(this.list[i])
          }
        }
        this.list = arr
        this.__vue.config.signals = arr
        this.__vue.handleReportSignal()
        this.__vue.dialogDelete = false
        this.status = null
        this.updateTotalNumber()
        signal_base.element_self.style.display = 'none'
      }
    }
  },
  showComment(e) {
    if (e.classList.contains('is-disabled')) return
    let obj = null
    const id = e.dataset.id
    for (let i = 0; i < signal_selected.list.length; i++) {
      if (signal_selected.list[i].signalRegisterId === id) {
        obj = signal_selected.list[i]
        break
      }
    }
    signal_selected.__vue.changeBtn('viewComment', obj)
  },
  showDetail(e) {
    if (e.classList.contains('is-disabled')) return
    let obj = null
    const id = e.dataset.id
    for (let i = 0; i < signal_selected.list.length; i++) {
      if (signal_selected.list[i].signalRegisterId === id) {
        obj = signal_selected.list[i]
        break
      }
    }
    signal_selected.__vue.changeBtn('viewDetail', obj)
  },
  addSignal() {
    this.element_body.insertAdjacentHTML('afterbegin', this.getTemplateSignal())
    this.updateTotalNumber()
    this.dynamicIcon()
  },
  updateTotalNumber() {
    document.querySelector('#signal_selected_total').innerHTML = this.element_body.querySelectorAll('tr').length
  },
  winEvent() {
    const self = this.element_active_signal
    if (self) {
      if (self.dataset.id && !self.value) { // 有信号，但没选
        self.value = self.placeholder
      } else if (self.dataset.id && self.value && self.value !== self.placeholder) { // 有信号用户有输入，但没选
        self.value = self.placeholder
      } else if (!self.dataset.id && self.value !== self.placeholder) { // 搜索结束，但没选
        self.value = ''
      }

      self.placeholder = 'Please select'
      self.classList.remove('is_active')
      this.element_active_signal = null
      signal_base.element_self.style.display = 'none'

      // 用户输入
      if (this.status === 'input') {
        signal_base.renderList()
        this.status = null
      }
    }
  },
  reset() {
    this.list = []
    this.element_body.innerHTML = ''
    document.querySelector('#signal_selected_total').innerHTML = 0
  }
}

window.showSelectedComment = signal_selected.showComment
window.showSelectedDetail = signal_selected.showDetail

export default signal_selected
