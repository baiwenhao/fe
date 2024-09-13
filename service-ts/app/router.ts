import { Application } from 'egg';

export = (app: Application) => {
    const { controller, router } = app;
    router.get('/', controller.home.index);
};
