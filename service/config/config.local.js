// exports.someKeys = 'abc';
module.exports = (appInfo) => {
  const config = {}
  config.view = { cache: false, }
  config.env = 'local'
  config.resource = {
    port: 9528,
  }

  config.news = {
    pageSize: 5,
    serverUrl: 'http://localhost:7001',
  }

  config.host = 'http://localhost:7001'

  return {
    ...config
  }
}
