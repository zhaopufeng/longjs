"use strict";
/**
 * @class @longjs/proxy
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const httpProxy = require("http-proxy");
let _proxy = httpProxy.createProxyServer({});
function proxyTable(ctx, options = {}) {
    Object.keys(options).forEach((key) => {
        proxy(key, ctx, options[key]);
    });
}
exports.proxyTable = proxyTable;
function proxy(path, ctx, proxyOptions) {
    if (RegExp(path).test(ctx.path)) {
        _proxy.web(ctx.req, ctx.res, proxyOptions);
    }
}
exports.proxy = proxy;
exports.default = proxyTable;
