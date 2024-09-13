import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { join } from 'path';



export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    config.keys = 'abc_1560419360605_9825';
    config.multipart = {
        fileSize: '50mb',
        mode: 'stream', // 必须写;千万别写错 file
        whitelist () {
            return true
        },
    };


    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.nj': 'nunjucks',
        },
        root: [
            join(appInfo.baseDir, 'app/view'),
        ].join(','),
    };

    config.httpclient= {
        request: {
            timeout: 9000000,
        }
    };

    config.cors = {
        credentials: true,
    };

    config.static = {
        prefix: '/public/',
        dir: join(appInfo.baseDir, 'app/public'), // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
        dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
        preload: false,
        maxAge: 31536000, // in prod env, 0 in other envs
        buffer: true, // in prod env, false in other envs
    };

    return {
        ...config,
    };
};
