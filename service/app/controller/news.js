const Controller = require('egg').Controller;

class NewsController extends Controller {
  async data () {
    return this.ctx.body = {
      list: [
        { id: 1, title: 'This is news 1', url: '/news/1', time: 1 },
        { id: 2, title: 'This is news 2', url: '/news/2', time: 1 }
      ]
    }
  }

  async list () {
    const { ctx, app } = this;
    // const newsList = {
    //   list: [
    //     { id: 1, title: 'This is news 1', url: '/news/1' },
    //     { id: 2, title: 'This is news 2', url: '/news/2' }
    //   ]
    // }

    const page = ctx.query.page || 1
    const newsList = await ctx.service.news.list(page)
    await ctx.render('news/list.tpl', newsList)
  }

  async detail () {
    const { ctx } = this;
    return ctx.body = `detail = ${ctx.params.id}`
  }

  async configuration () {
    const { ctx, app } = this
    ctx.body = app.config
  }
}

module.exports = NewsController