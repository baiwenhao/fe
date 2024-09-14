### Vue文件规范
本项目的风格指南主要是参照 vue 官方的[风格指南](https://cn.vuejs.org/v2/style-guide/index.html)
1. 组件名为多个单词
2. 组件的 data 必须是一个函数。
3. Prop 定义应该尽量详细。
4. 为 v-for 设置键值
5. 避免 v-if 和 v-for 用在一起
6. 私有属性名
具体详细请看文档，开发前务必看下！！


### 命名规范
1. 所有的Component文件都是以大写开头 (PascalCase)
2. 所有的.js,.css文件都遵循横线连接 (kebab-case)。
3. 在views文件下，代表路由的.vue文件都使用横线连接 (kebab-case)，代表路由的文件夹也是使用同样的规则。
使用横线连接 (kebab-case)来命名views主要是出于以下几个考虑。
    * 横线连接 (kebab-case) 也是官方推荐的命名规范之一 文档
    * views下的.vue文件代表的是一个路由，所以它需要和component进行区分(component 都是大写开头)
    * 页面的url 也都是横线连接的，比如https://www.xxx.admin/export-excel，所以路由对应的view应该要保持统一
    * 没有大小写敏感问题

### CSS规范
1. 统一使用scss编写css样式，
3. css class命名规范采用BEM，单词全小写字母，"m-ablock-element_modifier"
    * 布局（grid）（.g-head）；
    * 模块（module）（.m-dashborad）；
    * 元件（unit）（.u-select）;
4. 公用变量和mixin定义在styles下相应的文件夹
5. 其他请参考[stylelint-config-recommended](https://github.com/stylelint/stylelint-config-recommended)

### test规范
测试框架采用[jest](https://jestjs.io/zh-Hans/)和[vue-test-utils](https://vue-test-utils.vuejs.org/zh/)

### 其他注意事项
1. 环境变量必须以 VUE_APP_ 开头，使用时
```
process.env.VUE_APP_Public_Path
```

