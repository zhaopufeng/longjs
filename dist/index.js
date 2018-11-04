"use strict";
/**
 * @class @longjs/proxy
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const httpProxy = require("http-proxy");
let _proxy = httpProxy.createProxyServer({});
async function proxyTable(ctx, options = {}) {
    for (let key in options) {
        await proxy(key, ctx, options[key]);
    }
}
exports.proxyTable = proxyTable;
async function proxy(path, ctx, proxyOptions) {
    return new Promise((next, reject) => {
        const { changeOrigin, pathRewrite } = proxyOptions;
        if (!/\^/.test(path))
            path = `^${path}`;
        if (!/\$$/.test(path))
            path = `${path}$`;
        if (RegExp(path).test(ctx.path)) {
            if (typeof changeOrigin === 'undefined')
                proxyOptions.changeOrigin = true;
            const path = ctx.path;
            for (let item in pathRewrite) {
                let itemPath = item;
                let itemPath2;
                // pathRewrite
                if (!/\^/.test(itemPath))
                    itemPath = `^${itemPath}`;
                if (!/\$$/.test(itemPath)) {
                    itemPath = `${itemPath}$`;
                    itemPath2 = `${itemPath}/$`;
                }
                if (RegExp(itemPath).test(path)) {
                    ctx.req.url = ctx.req.url.replace(RegExp(itemPath), pathRewrite[item]).replace(/[\/]{2,}/g, '/');
                }
                else if (RegExp(itemPath2).test(path)) {
                    ctx.req.url = ctx.req.url.replace(RegExp(itemPath2), pathRewrite[item]).replace(/[\/]{2,}/g, '/');
                }
            }
            // proxy
            _proxy.web(ctx.req, ctx.res, proxyOptions);
            _proxy.on('error', function (err) {
                reject(err);
            });
        }
        else {
            next();
        }
    });
}
exports.proxy = proxy;
exports.default = proxyTable;
