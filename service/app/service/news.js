const Service = require('egg').Service;

class NewsService extends Service {
  async list(page = 1) {

    const { serverUrl, pageSize } = this.config.news;

    const { data: idList } = await this.ctx.curl(
      `${serverUrl}/news/data`,
      {
        data: {
          orderBy: '"$key"',
          startAt: `"${pageSize * (page - 1)}"`,
          endAt: `"${pageSize * page - 1}"`,
        },
        dataType: 'json',
      }
    );

    return idList
  }
}

module.exports = NewsService;
