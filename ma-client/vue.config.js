
'use strict';
const path = require('path');
const glob = require('glob');
const ManifestPlugin = require('webpack-manifest-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

// 配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
    const entries = {};
    let basename;
    let tmp;
    let pathname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = basename; // 正确输出js和html的路径

        entries[pathname] = {
            entry: './src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[1] + '.js',
            template: './src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
            chunks: ['chunk-libs', 'chunk-elementUI', 'chunk-commons', tmp[1], 'runtime'],
            title: tmp[2],
            timer: new Date().toLocaleString(),
            // filename: resolve('../server/app/view/main.nj') // tmp[2]
            filename: tmp[2]
            // user: require(`./mock/page/${pathname}.json`)

        };
    });
    return entries;
}

function resolve(dir) {
    return path.join(__dirname, dir);
}

const pages = getEntry('./src/pages/**?/*.html');

const name = 'RTG'; // page title
const microName = 'parent';
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 9528; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
    publicPath: `${process.env.VUE_APP_PUBLIC_PATH}` + (process.env.NODE_ENV === 'development' ? `:${port}/` : '/'),
    // outputDir:  resolve('../server/app/public'),
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    pages,
    devServer: {
        port: port,
        open: true,
        index: 'main.html', // 默认启动serve 打开page1页面
        historyApiFallback: {
            rewrites: [{
                from: /.*/g,
                to: '/main.html'
            }]
        },
        overlay: {
            warnings: false,
            errors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
        // proxy: {
        //     // change xxx-api/login => mock/login
        //     // detail: https://cli.vuejs.org/config/#devserver-proxy
        //     [process.env.VUE_APP_BASE_API]: {
        //         target: `http://127.0.0.1:8002/`,
        //         changeOrigin: true,
        //         pathRewrite: {
        //             ['^' + process.env.VUE_APP_BASE_API]: ''
        //         }
        //     }
        // }
    },
    configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
        
        name: name,
        resolve: {
            alias: {
                '@': resolve('src'),
                'Shared': resolve('../shared'),
                'element-ui': path.resolve(process.cwd(), 'node_modules', 'element-ui')
            }
        },
        plugins: [
            new ManifestPlugin(),
            new StyleLintPlugin({
                'files': ['**/*.{vue,sass,scss}'],
                'fix': false,
                'cache': true,
                'emitErrors': true,
                'failOnError': false
            })
        ]
    },
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
            // @/ 是 src/ 的别名
            // 所以这里假设你有 `src/variables.scss` 这个文件
                // data: `@import "~@ma-dev/theme/lib/var.scss";@import "~@/styles/mixin.scss";`
                data: `@import "~@/styles/variables.scss";@import "~@/styles/mixin.scss";`
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload'); // TODO: need test
        config.plugins.delete('prefetch'); // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true;
                return options;
            })
            .end();
        config.module
            .rule('ts')
            .test(/\.ts$/)
            .use('ts-loader')
            .loader('ts-loader')
            .end();
        config.module
            .rule('jsx')
            .test(/\.jsx$/)
            .use('babel-loader')
            .loader('babel-loader');

        config
        // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development',
                config => config.devtool('cheap-module-source-map')
            );

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // only package third parties that are initially dependent
                                },
                                elementUI: {
                                    name: 'chunk-elementUI', // split elementUI into a single package
                                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // can customize your rules
                                    minChunks: 3, //  minimum common number
                                    priority: 5,
                                    reuseExistingChunk: true
                                },
                                style: {
                                    name: 'chunk-elementUI',
                                    test: resolve('src/pages/main/theme/index.scss'), // can customize your rules
                                    minChunks: 1, //  minimum common number
                                    priority: 25
                                }
                            }
                        });
                    config.optimization.runtimeChunk('single');
                }
            );
    }
};
