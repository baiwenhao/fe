const { join } = require('path')
// const { EggAppConfig, EggAppInfo, PowerPartial } = require('egg')

module.exports = (appInfo) => {
  const config = {}
  config.keys = appInfo.name + '_1725602139308_5643'
  config.middleware = [ 'request' ]

  config.cors = {
    credentials: true,
  }

  config.httpclient= {
    request: {
      timeout: 9000000,
    }
  }

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
      '.tpl': 'nunjucks',
    },
    root: [ join(appInfo.baseDir, 'app/view'), ].join(','),
  }

  config.static = {
    prefix: '/public/',
    dir: join(appInfo.baseDir, 'app/public'),
    dynamic: true,
    preload: false,
    maxAge: 31536000,
    maxFiles: 100,
    buffer: true,
  }

  config.sessionRedis = {
    name: 'session', // specific instance `session` as the session store
  }

  return {
    ...config
  }
};