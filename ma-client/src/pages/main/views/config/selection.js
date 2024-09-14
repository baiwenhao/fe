const delay = (() => {
  let timer = 0
  return (callback, ms) => {
    clearTimeout(timer)
    if (!ms) ms = 100
    timer = setTimeout(callback, ms)
  }
})()

const selection = {
  __vue: undefined,
  self_element: null,
  __selected_list: [], // 已选择的信号数据
  __unselected_list: [], // 未选择过的信号数据

  getItemTemplate(arr) {
    let tpl = ''
    for (let i = 0; i < arr.length; i++) {
      tpl += '' +
      '<label class="el-checkbox" data-value="' + arr[i].__value + '" data-id="' + arr[i].lRegisterId + '">' +
      '    <span class="el-checkbox__inner"></span>' + arr[i].lSignalName +
      '  <span class="f1"></span>' +
      '  <span>' + arr[i].lRegisterId + '</span>' +
      '</label>'
    }
    return tpl
  },
  handleEvent(e) {
    const el = e.target
    if (el.id === 'btn_cancel') {
      this.hide()
    } else if (el.id === 'btn_ok') {
      this.hide()
      this.__vue.__setSignal(this.__selected_list)
    } else if (el.id === 'btn_close') {
      this.hide()
    }
  },
  init(unselected, selected) {
    if (!selected) selected = []
    const tmp = this.getTemplate()
    document.body.insertAdjacentHTML('beforeend', tmp)

    // 重置
    this.__unselected_list = []
    this.__selected_list = []
    this.self_element = document.querySelector('#selection_container')

    const btn_cancel = this.self_element.querySelector('#btn_cancel')
    const btn_close = this.self_element.querySelector('#btn_close')
    const btn_ok = this.self_element.querySelector('#btn_ok')
    const btn_control_left = this.self_element.querySelector('#btn_control_left')
    const btn_control_right = this.self_element.querySelector('#btn_control_right')
    const btn_all_left = this.self_element.querySelector('#btn_all_left')
    const btn_all_right = this.self_element.querySelector('#btn_all_right')
    const main_left = this.self_element.querySelector('#signal_main_left')
    const main_right = this.self_element.querySelector('#signal_main_right')
    const filter_left = this.self_element.querySelector('#signal_filter_left') // search
    const filter_right = this.self_element.querySelector('#signal_filter_right')
    const signal_total = this.self_element.querySelector('#signal_total') // 总数
    const signal_selected_count = this.self_element.querySelector('#signal_selected_count') // 已选
    const signal_total_left = this.self_element.querySelector('#signal_total_left') // 数量总数和已选数量用左右区分
    const signal_total_right = this.self_element.querySelector('#signal_total_right')
    const signal_selected_left = this.self_element.querySelector('#signal_selected_left')
    const signal_selected_right = this.self_element.querySelector('#signal_selected_right')
    const btn_close_left = this.self_element.querySelector('#close_input_left')
    const btn_close_right = this.self_element.querySelector('#close_input_right')

    btn_cancel.addEventListener('click', this, false)
    btn_close.addEventListener('click', this, true)
    btn_ok.addEventListener('click', this, false)
    filter_left.addEventListener('input', this.filterData.bind(this, btn_close_left, main_left), false)
    filter_right.addEventListener('input', this.filterData.bind(this, btn_close_right, main_right), false)
    btn_close_left.addEventListener('click', this.clearInput.bind(this, filter_left, main_left), false)
    btn_close_right.addEventListener('click', this.clearInput.bind(this, filter_right, main_right), false)
    btn_all_left.addEventListener('click', this.selectAllClick.bind(this, main_left, btn_control_right, signal_selected_left), true)
    btn_all_right.addEventListener('click', this.selectAllClick.bind(this, main_right, btn_control_left, signal_selected_right), true)
    main_left.addEventListener('click', this.itemClick.bind(this, main_left, signal_selected_left, btn_control_right, btn_all_left), false)
    main_right.addEventListener('click', this.itemClick.bind(this, main_right, signal_selected_right, btn_control_left, btn_all_right), false)
    btn_control_left.addEventListener('click', this.moveSignal.bind(this, 'left', main_left, signal_total_left, signal_selected_left, main_right, signal_total_right, signal_selected_right, btn_all_left, btn_all_right, signal_selected_count, filter_left, filter_right, btn_close_left, btn_close_right), false)
    btn_control_right.addEventListener('click', this.moveSignal.bind(this, 'right', main_left, signal_total_left, signal_selected_left, main_right, signal_total_right, signal_selected_right, btn_all_left, btn_all_right, signal_selected_count, filter_left, filter_right, btn_close_left, btn_close_right), false)

    if (selected && selected.length) {
      // unselected 包含全量信号，也包含了已选信号 selected
      // lSignalName 判断标识，过滤出 __unselected_list 和 __selected_list
      const __selected_list_id = []
      const __signalName = []
      for (let i = 0; i < selected.length; i++) __signalName.push(selected[i].signalName)
      for (let i = 0; i < unselected.length; i++) {
        const name = unselected[i].lSignalName
        unselected[i].signalName = name

        if (__signalName.indexOf(name) <= -1) {
          this.__unselected_list.push(unselected[i])
        } else {
          this.__selected_list.push(unselected[i])
          __selected_list_id.push(unselected[i].lRegisterId)
        }
      }

      main_left.insertAdjacentHTML('beforeend', this.getItemTemplate(unselected))
      main_right.insertAdjacentHTML('beforeend', this.getItemTemplate(unselected))

      // 已选信号hide
      const __left_list = main_left.querySelectorAll('.el-checkbox')
      for (let i = 0; i < __left_list.length; i++) {
        if (__selected_list_id.indexOf(__left_list[i].dataset.id) >= 0) {
          __left_list[i].style.display = 'none'
        }
      }

      const __right_list = main_right.querySelectorAll('.el-checkbox')
      for (let i = 0; i < __right_list.length; i++) {
        if (__selected_list_id.indexOf(__right_list[i].dataset.id) <= -1) {
          __right_list[i].style.display = 'none'
        }
      }
    } else {
      for (let i = 0; i < unselected.length; i++) {
        unselected[i].signalName = unselected[i].lSignalName
        this.__unselected_list.push(unselected[i])
      }
      main_left.insertAdjacentHTML('beforeend', this.getItemTemplate(unselected))
      main_right.insertAdjacentHTML('beforeend', this.getItemTemplate(unselected))

      const __right_list = main_right.querySelectorAll('.el-checkbox')
      for (let i = 0; i < __right_list.length; i++) {
         __right_list[i].style.display = 'none'
      }
    }

    signal_total_left.innerHTML = this.__unselected_list.length
    signal_total_right.innerHTML = this.__selected_list.length
    signal_selected_count.innerHTML = this.__selected_list.length
    signal_total.innerHTML = unselected.length
  },
  clearInput(input, main, e) {
    input.value = ''
    input.focus()
    e.target.style.display = 'none'
    const list = main.querySelectorAll('.el-checkbox')
    for (let i = 0; i < list.length; i++) {
      list[i].style.display = ''
    }
  },
  filterData(btn, main, e) {
    const val = e.target.value.replace(/\s/g, '')
    btn.style.display = val ? 'block' : 'none'
    delay(() => {
      const list = main.querySelectorAll('.el-checkbox')
      for (let i = 0; i < list.length; i++) {
        const value = list[i].dataset.value

        if (value.indexOf(val) >= 0) {
          list[i].style.display = ''
        } else {
          list[i].style.display = 'none'
        }
      }
    }, 600)
  },
  moveSignal(direction, left_parent, left_total, left_count, right_parent, right_total, right_count, btn_all_left, btn_all_right, selected_count, filter_left, filter_right, btn_close_left, btn_close_right, e) {
    if (e.target.classList.contains('selection_btn_disabled')) return
    e.target.classList.add('selection_btn_disabled')

    // update dom
    const ids = []
    // const parent = direction === 'left' ? left_parent : right_parent
    const list = (direction === 'left' ? right_parent : left_parent).querySelectorAll('.el-checkbox')
    const __left_parent_list = left_parent.querySelectorAll('.el-checkbox')
    const __right_parent_list = right_parent.querySelectorAll('.el-checkbox')

    for (let i = 0; i < list.length; i++) {
      if (list[i].classList.contains('is-checked')) {
        ids.push(list[i].dataset.id) // 已选 lRegisterId
        list[i].classList.remove('is-checked')
        // parent.insertAdjacentElement('beforeend', list[i])
      }
      // list[i].style.display = '' // 显示隐藏信号
    }
    // console.log(ids, direction)
    for (let i = 0; i < __left_parent_list.length; i++) {
      if (ids.indexOf(__left_parent_list[i].dataset.id) >= 0) {
        __left_parent_list[i].style.display = direction === 'left' ? '' : 'none'
      }
    }
    for (let i = 0; i < __right_parent_list.length; i++) {
      if (ids.indexOf(__right_parent_list[i].dataset.id) >= 0) {
        __right_parent_list[i].style.display = direction === 'right' ? '' : 'none'
      }
    }

    // update data
    const __unselected_list = [] // 未购选
    const __selected_list = [] // 已购选

    if (direction === 'left') {
      for (let i = 0; i < this.__selected_list.length; i++) {
        if (ids.indexOf(this.__selected_list[i].lRegisterId) >= 0) {
          __selected_list.push(this.__selected_list[i])
        } else {
          __unselected_list.push(this.__selected_list[i])
        }
      }
      right_count.innerHTML = 0

      this.__selected_list = __unselected_list
      // const __list = this.__unselected_list.slice(0)
      this.__unselected_list.unshift(...__selected_list)
      // __list.unshift(...__selected_list)
      // __list.sort(function (a, b) {
      //   return a.lRegisterId - b.lRegisterId
      // })
      // this.__unselected_list = __list
    } else if (direction === 'right') {
      for (let i = 0; i < this.__unselected_list.length; i++) {
        if (ids.indexOf(this.__unselected_list[i].lRegisterId) <= -1) {
          __unselected_list.push(this.__unselected_list[i])
        } else {
          __selected_list.push(this.__unselected_list[i])
        }
      }
      left_count.innerHTML = 0
      this.__unselected_list = __unselected_list
      this.__selected_list.unshift(...__selected_list)
    }

    btn_all_right.classList.remove('is-indeterminate')
    btn_all_right.classList.remove('is-checked')
    btn_all_left.classList.remove('is-indeterminate')
    btn_all_left.classList.remove('is-checked')

    // update number
    left_total.innerHTML = this.__unselected_list.length
    right_total.innerHTML = this.__selected_list.length
    selected_count.innerHTML = this.__selected_list.length

    console.log('未选择=' + this.__unselected_list.length, '已经选=' + this.__selected_list.length)
    filter_left.value = ''
    filter_right.value = ''
    btn_close_left.style.display = 'none'
    btn_close_right.style.display = 'none'
  },
  selectAllClick(main, btn, count, e) {
    let allCount = 0
    const list = main.querySelectorAll('.el-checkbox')
    if (e.target.classList.contains('is-checked')) { // 已全选
      for (let i = 0; i < list.length; i++) {
        if (list[i].style.display !== 'none') {
          list[i].classList.remove('is-checked')
        }
      }
      e.target.className = 'el-checkbox'
      btn.classList.add('selection_btn_disabled')
      count.innerHTML = 0
    } else if (e.target.classList.contains('is-indeterminate')) { // 半选
      for (let i = 0; i < list.length; i++) {
        if (!list[i].classList.contains('is-checked') && list[i].style.display !== 'none') {
          list[i].classList.add('is-checked')
        }
        if (list[i].style.display !== 'none') {
          allCount += 1
        }
      }

      e.target.classList.remove('is-indeterminate')
      e.target.classList.add('is-checked')
      btn.classList.remove('selection_btn_disabled')
      count.innerHTML = allCount
    } else { // 未选
      for (let i = 0; i < list.length; i++) {
        if (list[i].style.display !== 'none') {
          allCount += 1
          list[i].classList.add('is-checked')
        }
      }

      e.target.classList.add('is-checked')
      btn.classList.remove('selection_btn_disabled')
      count.innerHTML = allCount
    }
  },
  itemClick(el_parent, el_count, btn_control, btn_all, e) {
    // 更新 item 状态
    const el = e.target
    if (el.classList.contains('is-checked')) {
      el.classList.remove('is-checked')
    } else {
      el.classList.add('is-checked')
    }

    // 更新计数
    let n = 0
    const main = el_parent.querySelectorAll('.el-checkbox')
    for (let i = 0; i < main.length; i++) {
      if (main[i].classList.contains('is-checked')) n += 1
    }
    el_count.innerHTML = n

    // 更新控制按钮状态
    if (n >= 1) {
      btn_control.classList.remove('selection_btn_disabled')
    } else {
      btn_control.classList.add('selection_btn_disabled')
    }

    // 更新全选状态
    if (main.length === n) {
      btn_all.classList.remove('is-indeterminate')
      btn_all.classList.add('is-checked')
    } else if (n === 0) {
      btn_all.classList.remove('is-checked')
      btn_all.classList.remove('is-indeterminate')
    } else if (n >= 1) {
      btn_all.classList.remove('is-checked')
      btn_all.classList.add('is-indeterminate')
    }
  },
  hide(cb) {
    document.body.removeChild(this.self_element)
    cb && cb()
  },
  getTemplate() {
    const template = '' +
    '<div id="selection_container" class="selection_mask">' +
    '  <div class="selection">' +
    '    <div class="selection_head f14">' +
    '      <strong>Create Signal</strong>' +
    '      <div class="btn_close">' +
    '        <svg id="btn_close" t="1685673514483" width="26" height="26" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2372"><path d="M816 816m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#777" p-id="2373"></path><path d="M512 968a456 456 0 1 1 395.76-229.36 32 32 0 0 1-55.52-32 392 392 0 1 0-145.44 145.44 32 32 0 0 1 32 55.52A456 456 0 0 1 512 968z" fill="#777" p-id="2374"></path><path d="M376 680a32 32 0 0 1-22.64-54.64L625.12 353.6a32 32 0 1 1 45.28 45.28L398.88 670.4A32 32 0 0 1 376 680z" fill="#777" p-id="2375"></path><path d="M648 680a32 32 0 0 1-22.64-9.36L353.6 398.88a32 32 0 0 1 45.28-45.28L670.4 625.12A32 32 0 0 1 648 680z" fill="#707070" p-id="2376"></path></svg>' +
    '      </div>' +
    '    </div>' +

    '    <div class="selection_flex">' +
           // 1 未选择列表
    '      <div class="selection_main">' +
    '        <div class="selection_title">' +
    '          <label id="btn_all_left" class="el-checkbox">' +
    '            <div class="el-checkbox__inner"></div>' +
    '            Unselected signal' +
    '          </label>' +
    '          <div class="f1"></div>' +
    '          <div><span id="signal_selected_left">0</span>/<span id="signal_total_left">0</span></div>' +
    '        </div>' +
    '        <div class="pr">' +
    '          <input id="signal_filter_left" class="selection_filter" type="text" name="signal" placeholder="Please enter signal name or registry id" />' +
    '          <svg id="close_input_left" class="input_close" t="1685673514483" width="20" height="20" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2372"><path d="M816 816m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#777" p-id="2373"></path><path d="M512 968a456 456 0 1 1 395.76-229.36 32 32 0 0 1-55.52-32 392 392 0 1 0-145.44 145.44 32 32 0 0 1 32 55.52A456 456 0 0 1 512 968z" fill="#777" p-id="2374"></path><path d="M376 680a32 32 0 0 1-22.64-54.64L625.12 353.6a32 32 0 1 1 45.28 45.28L398.88 670.4A32 32 0 0 1 376 680z" fill="#777" p-id="2375"></path><path d="M648 680a32 32 0 0 1-22.64-9.36L353.6 398.88a32 32 0 0 1 45.28-45.28L670.4 625.12A32 32 0 0 1 648 680z" fill="#707070" p-id="2376"></path></svg>' +
    '        </div>' +
    '        <div id="signal_main_left" class="selection_list"></div>' +
    '      </div>' +

           // 2 操作区域
    '      <div class="selection_control">' +
    '        <div id="btn_control_left" class="selection_btn selection_btn_disabled">' +
    '          <b class="selection_btn_select"></b>' +
    '        </div>' +
    '        <div style="height: 12px"></div>' +
    '        <div id="btn_control_right" class="selection_btn selection_btn_disabled">' +
    '          <b class="selection_btn_cancel"></b>' +
    '        </div>' +
    '      </div>' +

           // 3 已选择列表
    '      <div class="selection_main">' +
    '        <div class="selection_title">' +
    '          <label id="btn_all_right" class="el-checkbox">' +
    '            <div class="el-checkbox__inner"></div>Selected signal' +
    '          </label>' +
    '          <div class="f1"></div>' +
    '          <div><span id="signal_selected_right">0</span>/<span id="signal_total_right">0</span></div>' +
    '        </div>' +
    '        <div class="pr">' +
    '          <input id="signal_filter_right" class="selection_filter" type="text" name="signal" placeholder="Please enter signal name or registry id" />' +
    '          <svg id="close_input_right"  class="input_close" t="1685673514483" width="20" height="20" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2372"><path d="M816 816m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#777" p-id="2373"></path><path d="M512 968a456 456 0 1 1 395.76-229.36 32 32 0 0 1-55.52-32 392 392 0 1 0-145.44 145.44 32 32 0 0 1 32 55.52A456 456 0 0 1 512 968z" fill="#777" p-id="2374"></path><path d="M376 680a32 32 0 0 1-22.64-54.64L625.12 353.6a32 32 0 1 1 45.28 45.28L398.88 670.4A32 32 0 0 1 376 680z" fill="#777" p-id="2375"></path><path d="M648 680a32 32 0 0 1-22.64-9.36L353.6 398.88a32 32 0 0 1 45.28-45.28L670.4 625.12A32 32 0 0 1 648 680z" fill="#707070" p-id="2376"></path></svg>' +
    '        </div>' +
    '        <div id="signal_main_right" class="selection_list"></div>' +
    '      </div>' +
    '    </div>' +

    '    <div class="selection_flex pt12">' +
    '      <div class="mr12"><span id="signal_total">0</span> in total / <span id="signal_selected_count">0</span> selected</div>' +
    '      <div class="f1"></div>' +
    '      <div id="btn_cancel" class="selection_btn p24 mr12 cancel f14">Cancel</div>' +
    '      <div id="btn_ok" class="selection_btn p24 f14">OK</div>' +
    '    </div>' +
    '  </div>' +
    '</div>'
    return template
  }
}

export default selection
