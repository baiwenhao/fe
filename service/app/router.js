module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.news.configuration);

  router.get('/news', controller.news.list);
  router.get('/news/data', controller.news.data);
  router.get('/news/:id', controller.news.detail);
};

