module.exports = () => {
    return async function request(ctx, next) {
        ctx.logger.info(
            `FE Request:
            ${JSON.stringify(ctx.request)}`,
        );
        ctx.app.currentCtx = Object.assign({}, ctx.headers);
        // ctx.logger.info({
        //     "operationLogKey": "fe",
        //     "method": ctx.request.method,
        //     "url": ctx.app.config.remoteHost + ctx.request.url,
        // });
        await next();
    };
};
