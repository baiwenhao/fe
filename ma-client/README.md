## 项目结构
```
├── docs                      // 说明文档
├── mock                      // nei mock
│   ├── api                   // mock ajax
│   └── page                  // mock page
├── nei.*
│   └── server.config.js      // nei 配置文件（nei 配置、接口代理、是否监听文件并自动刷新浏览器等）
├── docs                      // 说明文档
├── node_modules              // npm 依赖
│   ├── gulp-sass
│   └── .....
├── dist				      // 打包输出文件
│   ├── static		          // 静态资源，线上放cdn
│   │   ├── css           
│   │   ├── fonts        
│   │   ├── img           
│   │   └── js		     
│   └── *.html			      // 入口页面, 开发是用到，线上用的是后端模板
├── plop-templates		      // view, component, store, api 模板，后续考虑用nei管理
│   ├── api		              // api模板
│   ├── component		      // 组件模板
│   └── view		          // view模板
├── scripts                   // 辅助脚本
├── src
│   ├── api                   // 后端接口
│   ├── assets                // 资源文件
│   ├── common                //公共js资源
│   │   ├── directive         // 公用directive
│   │   ├── filters           // 公用filters
│   │   ├── store             // 公用store
│   │   └── utils             // helper函数
│   ├── components            // 公用组件
│   ├── icons                 // 图标
│   ├── lang                  // 国际化语言
│   ├── pages                 // 每个页面
│   │   ├── main              // main页面
│   │   │   ├── layout        // 布局
│   │   │   ├── router        // 路由
│   │   │   ├── store         // store
│   │   │   └── views         // 业务模块
│   │   └── login             // login页面
│   ├── styles                // 公共样式
│   │   ├── variables.scss    // 公用样式变量
│   │   ├── index.scss        // 主入口样式，reset
│   │   └── mixin.scss        // 公用样式mixin
│   ├── vendor                // 第三方库
│   └── views                 // 页面公共模块
├── test                      // 测试
├── .env.*                    // 不同环境的配置文件
├── .eslintignore             // eslint ignore config
├── .eslintrc.js              // eslint 配置文件
├── .lintstagedrc             // lint-stage 配置文件
├── .stylelintrc.json         // stylelint 配置文件
├── .babel.config.js          //babel 配置文件
├── .commitlint.config.js     // commitlint 配置文件
├── .jest.config.js           // jest 配置文件
├── .plopfile.js              // plopfile 配置文件
├── .postcss.config.js        //postcss 配置文件
├── vue.config.js             // webpack配置
├── package.json              // npm  依赖管理
└── README.md
```

## 开发步骤
### 1）初始化nei-mock(第一次需要，后面只需要更新mock数据)
```
yarn mapi:build  // 下载nei配置 本地产生 mock文件
```
更新mapi-mock（nei 接口有更新的情况下执行）
```
yarn mapi:update     // 注意：只下载新接口，不覆盖本地原有接口，故建议直接删除mock文件夹，再更新
```

#### 2）启动nei server mock数据
```
yarn mapi:serve    // mapi mock 端口为8002， 需要和vue.config.js 里面代理的端口一致  todo 能否集成进webpack-server
```
#### 3）本地启动工程
```
yarn dev
```

This will automatically open http://localhost:9528

## 第四步 - 部署
```bash
yarn run build:prod 编辑打包
yarn run upload 上传华为云
```
最后一步 jenkins 构建 service 端即可

## 其他功能说明

```bash

# code format check
yarn lint

# code format check and auto fix
yarn lint -- --fix

# generate component, view template
yarn new
```

##other
1. 项目基于vue-element-admin，建议看下[文档](https://panjiachen.gitee.io/vue-element-admin-site/)
