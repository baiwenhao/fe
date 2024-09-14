import signal_base from './signal_base'
import signal_selected from './signal_selected'

const delay = (() => {
  let timer = 0
  return (callback, ms) => {
    clearTimeout(timer)
    if (!ms) ms = 100
    timer = setTimeout(callback, ms)
  }
})()

const validatorConfigName = (r, v, c) => {
  if (v && /[^a-zA-Z0-9_]/g.test(v) === true) return c(new Error('Cannot contain special characters'))
  c()
}

const getOffset = (el, type) => {
  let off = el[type]
  let par = el.offsetParent
  while (par) {
    off += par[type]
    par = par.offsetParent
  }
  return off
}

const handerRepeat = (arr, name) => {
  const map = new Map()
  const result = []

  for (const item of arr) {
    if (name) {
      if (!map.has(item.name)) {
        map.set(item.name, true)
        result.push(item)
      }
    } else {
     if (!map.has(item)) {
        map.set(item, true)
        result.push(item)
      }
    }
  }
  return result
}

// const validatorDataSet = (r, v, c) => {
//   if (parseInt(v) === 0) {
//     return c(new Error('Minimum value error'))
//   }
//   if (parseInt(v) > 65534) {
//     return c(new Error('Maximum value error'))
//   }
//   c()
// }

const validatorFrequency = (r, v, c) => {
  delay(() => {
    const unit = document.querySelector('#unit_value')
    if (unit.value === 'second') {
      if (v < 60) return c(new Error('Cannot be less than 60'))
      if (v > 3600) return c(new Error('The range is 3600 senconds<=report frequency<=60 minutes'))
      // if (v > 3600) return c(new Error('The range is 60 senconds<=report frequency<=60 minutes'))
      // if (v < 1) return c(new Error('Cannot be less than 1'))
      c()
    } else if (unit.value === 'minute') {
      if (v < 1) return c(new Error('Cannot be less than 1'))
      if (v > 60) return c(new Error('The range is 60 minutes<=report frequency<=60 minutes'))
      // if (v > 60) return c(new Error('The range is 60 senconds<=report frequency<=60 minutes'))
      // if (v < 1) return c(new Error('Cannot be less than 1'))
      c()
    } else {
      c()
    }
  }, 200)
}

const handle = (arr, name) => {
  const map = new Map()
  const result = []

  for (const item of arr) {
    if (!map.has(item[name])) {
      map.set(item[name], true)
      result.push(item)
    }
  }
  return result
}

const baseInfo = {
  configName: [
    { required: true, message: 'Please enter package name', trigger: 'blur' },
    { min: 1, max: 20, message: '3 to 20 characters in length', trigger: 'blur' },
    { validator: validatorConfigName, trigger: 'blur' }
  ],
  configVersion: [
    { required: true, message: 'Please select version', trigger: 'blur' }
  ],
  configFrequency: [
    { required: true, message: 'Please enter time', trigger: 'blur' },
    { validator: validatorFrequency, trigger: ['blur', 'change'] }
    // { min: 1, max: 6, message: '1 to 6 characters in length', trigger: 'change' }
  ],
  // configDataSets: [
  //   { required: true, message: 'Please enter data set', trigger: 'blur' },
  //   { validator: validatorDataSet, trigger: 'blur' }
  // ],
  consentId: [
    { required: true, message: 'Please select a consent', trigger: 'change' }
  ],
  // configRtgIni: [
  //   { required: true, message: 'Please select ini', trigger: 'change' }
  // ],
  baseListId: [
    { required: true, message: 'Please select one baselist', trigger: 'change' }
  ]
}

const controlSet = {
  controlSetName: {
    required: true, message: 'The Data Package Name cannot be empty', trigger: 'blur'
  },
  check(rule, value, callback, v) {
    console.log(v)
    if (value === undefined) {
      return callback(new Error('The Data Package Name cannot be empty'))
    }
    callback()
  }
}

const winEvent = function() {
  signal_selected.winEvent()
}

const initEvent = (() => {
  document.body.addEventListener('click', winEvent, false)
  return {}
})()

const lockScreen = (event) => {
  event = event || window.event
  if (event.preventDefault) {
    event.preventDefault()
    event.stopPropagation()
  } else {
    event.cancelBubble = true
    event.returnValue = false
  }
  return false
}

const isRepeat = (arr, name) => {
  const hash = {}
  let i = ''
  for (i in arr) {
    if (name && hash[arr[i][name]]) {
      return true
    } else if (hash[arr[i]]) {
      return true
    }
    if (name) {
      hash[arr[i][name]] = true
    } else {
      hash[arr[i]] = true
    }
  }
  return false
}

const __triggerValue = {
  required: true,
  trigger: ['blur', 'change'],
  validator: function(r, v, c) {
    if (v && typeof v !== 'number') v = v.replace(/\s/g, '')
    if (v === 0) return c()
    if (!v || v === null || v === 'null') return c(new Error('Cannot be empty'))
    if (/[^-0-9.]/g.test(v)) return c(new Error('please enter a number'))
    if (r.field) {
      const arr = r.field.split('.')
      if (arr && arr[1]) return window.__externalEvent(arr[1], c)
    }
    c()
  }
}

const generateMixed = (n) => {
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let res = ''
  for (let i = 0; i < n; i++) {
    const id = Math.floor(Math.random() * 36)
    res += chars[id]
  }
  return res
}

export {
  delay,
  winEvent,
  initEvent,
  lockScreen,
  getOffset,
  baseInfo,
  controlSet,
  signal_base,
  signal_selected,
  __triggerValue,
  isRepeat,
  handle,
  handerRepeat,
  generateMixed
}
