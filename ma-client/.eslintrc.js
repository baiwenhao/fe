module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-plugin-vue-libs
  rules: {
    "template-curly-spacing" : "off",
    "indent" : "off",
    "vue/max-attributes-per-line": [2, {
      "singleline": 10,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/html-closing-bracket-newline": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/multiline-html-element-content-newline": 0,
    "vue/name-property-casing": [2, "PascalCase"],
    "vue/no-v-html": 0,
    "vue/html-self-closing": 0,
    'arrow-spacing': [2, {// 箭头函数空格
      'before': true,
      'after': true
    }],
    'block-spacing': [2, 'always'], // 块级空格
    'brace-style': [2, '1tbs', { // 块级样式
      'allowSingleLine': true
    }],
    'camelcase': [0, { // 属性需要驼峰
      'properties': 'always'
    }],
    'comma-dangle': [2, 'never'], // 属性最后得逗号不用
    'comma-spacing': [2, { // 逗号前后空格
      'before': false,
      'after': true
    }],
    'comma-style': [2, 'last'], // 逗号操作放后面
    'curly': [2, 'multi-line'], //  强制所有控制语句使用一致的括号风格
    'dot-location': [2, 'property'], // dot 后一定要跟属性
    'eol-last': 2, // 文件结尾空一行
    'generator-star-spacing': [2, { // * 前后空格
        'before': true,
        'after': true
      }],
    'jsx-quotes': [2, 'prefer-single'], // jsx 单引号
    'key-spacing': [2, { // 属性名，冒号后面空格
      'beforeColon': false,
      'afterColon': true
    }],
    'keyword-spacing': [2, { // 关键字前后空格
      'before': true,
      'after': true
    }],
    'new-parens': 2, // new 操作要括号
    'no-extra-parens': [2, 'functions'], // 不需要额外括号，
    'no-irregular-whitespace': 2,
    'no-multi-spaces': 2,// 禁止多行字符串
    'no-multi-str': 2,// 禁止多行字符串
    'no-multiple-empty-lines': [2, {//不允许多个空行
      'max': 1
    }],
    'no-trailing-spaces': 2,// 禁用行尾空白
    'one-var': [2, { // 强制函数中的变量分开声明
    'initialized': 'never'
    }],
    'operator-linebreak': [2, 'after', {// 强制操作符使用一致的换行符风格
    'overrides': {
        '?': 'before',
        ':': 'before'
    }
    }],
    'padded-blocks': [2, 'never'],
    'quotes': [2, 'single', {// 强制使用一致的单引号
        'avoidEscape': true,
        'allowTemplateLiterals': true
        }],
    'semi': 0, // 需要分号
    'indent': 0,
    'semi-spacing': [2, {// 强制分号后有空格
        'before': false,
        'after': true
    }],
    'space-before-blocks': [2, 'always'],// 禁止语句块之前的空格
    'space-before-function-paren': [2, 'never'],// 禁止函数圆括号之前有一个空格
    'space-in-parens': [2, 'never'],// 禁止或强制圆括号内的空格
    'space-infix-ops': 2,  // 要求中缀操作符周围有空格
    'space-unary-ops': [2, {  // 禁止在一元操作符之前或之后存在空格
        'words': true,
        'nonwords': false
    }],
    'spaced-comment': [2, 'always', { // 要求在注释前有空白
        'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }],
    'no-whitespace-before-property': 2,// 禁止属性前有空白
    // 'template-curly-spacing': [2, 'never'],// 强制模板字符串中空格的使用
    'object-curly-spacing': [2, 'always', {// 强制在花括号中使用一致的空格
        objectsInObjects: false
      }],
    'array-bracket-spacing': [2, 'never'], // 强制数组方括号中使用一致的空格，
    'yield-star-spacing': [2, 'both'], // 强制在 yield* 表达式中 * 周围使用空格
    
    'accessor-pairs': 2, // get 和 set 同时出现
    'eqeqeq': ["error", "always", {"null": "ignore"}], // 除了null 都用全等
    'new-cap': [2, { // new调用一个要首字母大写， 可以用new 调用首字母大写得函数
      'newIsCap': true,
      'capIsNew': false
    }],
    'no-array-constructor': 2, // 数组不要构造方式生成
    'no-caller': 2, // 禁用 arguments.caller 或 arguments.callee
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-control-regex': 0, // 禁止在正则表达式中使用控制字符
    'no-eval': 2,
    'no-extend-native': 2, // object 原型不能扩展
    'no-extra-bind': 2, // 没有额外bind
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
    'no-implied-eval': 2, // 禁止使用类似 eval() 的方法
    'no-inner-declarations': [2, 'functions'], // 禁止在嵌套的块中出现function 声明
    'no-iterator': 2,// 禁用迭代器
    'no-label-var': 2,//不允许标签与变量同名
    'no-labels': [2, { // 禁用标签语句
      'allowLoop': false,
      'allowSwitch': false
    }],
    'no-lone-blocks': 2, // 禁用不必要的嵌套块
    'no-new-object': 2,// 禁止使用 Object 构造函数
    'no-new-wrappers': 2, // 禁止原始包装实例
    'no-octal-escape': 2,// 禁用八进制字面量
    'no-proto': 2,// 禁用__proto__，改用 getPrototypeOf 方法替代 __proto__。
    'no-return-assign': [2, 'except-parens'], // 禁止在return语句中赋值
    'no-self-compare': 2, //禁止自身比较
    'no-sequences': 2, // 不允许使用逗号操作符
    'func-call-spacing': 2, // 禁止在函数标识符和其调用之间有空格
    'no-throw-literal': 2, // 禁止抛出异常字面量
    'no-undef-init': 2, // 禁止将变量初始化为 undefined
    'no-unmodified-loop-condition': 2,// 禁用一成不变的循环条件
    'no-unneeded-ternary': [2, {// 禁止可以在有更简单的可替代的表达式时使用三元操作符
      'defaultAssignment': false
    }],
    'no-useless-call': 2, // 禁用不必要的 .call() 和 .apply()
    'no-useless-computed-key': 2, // 禁止在对象中使用不必要的计算属性
    'no-useless-constructor': 2,// 禁用不必要的构造函数
    'no-else-return': 2,// 禁止 if 语句中 return 语句之后有 else 块
    'wrap-iife': [2, 'any'],// 需要把立即执行的函数包裹起来
    'yoda': [2, 'never'], // 禁止 “Yoda” 条件
    'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'valid-jsdoc': "warn"
  }
}
