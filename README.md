# @longjs/proxy 1.0.0

[![npm (scoped)](https://img.shields.io/npm/v/@longjs/proxy.svg)](https://www.npmjs.com/package/@longjs/proxy)

### Introduction

The module based on @longjs/core, used for HTTP proxy request.


### Use

```shell
> yarn add @longjs/proxy
```
or 

```shell
> npm install @longjs/proxy
```

### Examples

```ts
import Server from '@longjs/core'
import Proxy from '@longjs/proxy'

new Server({
    port: 3000,
    plugins: [
        new Proxy({
            '^/api': {
                target: 'https://www.qq.com/',
                changeOrigin: true,
                pathRewrite: {
                    '/api': '/'
                }
            },
            '^/baidu': {
                target: 'https://www.baidu.com/',
                changeOrigin: true,
                pathRewrite: {
                    '/baidu': '/'
                }
            }
        })
    ]
})
```

### Api

```ts
new Proxy(proxyTable: { [key: string]: Options })
```
#### Options

`proxyTable[key]` supports the following options:

*  **target**: url string to be parsed with the url module
*  **forward**: url string to be parsed with the url module
*  **agent**: object to be passed to http(s).request (see Node's [https agent](http://nodejs.org/api/https.html#https_class_https_agent) and [http agent](http://nodejs.org/api/http.html#http_class_http_agent) objects)
*  **ssl**: object to be passed to https.createServer()
*  **ws**: true/false, if you want to proxy websockets
*  **xfwd**: true/false, adds x-forward headers
*  **secure**: true/false, if you want to verify the SSL Certs
*  **toProxy**: true/false, passes the absolute URL as the `path` (useful for proxying to proxies)
*  **prependPath**: true/false, Default: true - specify whether you want to prepend the target's path to the proxy path
*  **ignorePath**: true/false, Default: false - specify whether you want to ignore the proxy path of the incoming request (note: you will have to append / manually if required).
*  **localAddress**: Local interface string to bind for outgoing connections
*  **changeOrigin**: true/false, Default: false - changes the origin of the host header to the target URL
*  **preserveHeaderKeyCase**: true/false, Default: false - specify whether you want to keep letter case of response header key
*  **auth**: Basic authentication i.e. 'user:password' to compute an Authorization header.
*  **hostRewrite**: rewrites the location hostname on (201/301/302/307/308) redirects.
*  **autoRewrite**: rewrites the location host/port on (201/301/302/307/308) redirects based on requested host/port. Default: false.
*  **protocolRewrite**: rewrites the location protocol on (201/301/302/307/308) redirects to 'http' or 'https'. Default: null.
*  **cookieDomainRewrite**: rewrites domain of `set-cookie` headers. Possible values:
   * `false` (default): disable cookie rewriting
   * String: new domain, for example `cookieDomainRewrite: "new.domain"`. To remove the domain, use `cookieDomainRewrite: ""`.
   * Object: mapping of domains to new domains, use `"*"` to match all domains.
     For example keep one domain unchanged, rewrite one domain and remove other domains:
     ```
     cookieDomainRewrite: {
       "unchanged.domain": "unchanged.domain",
       "old.domain": "new.domain",
       "*": ""
     }
     ```
*  **cookiePathRewrite**: rewrites path of `set-cookie` headers. Possible values:
   * `false` (default): disable cookie rewriting
   * String: new path, for example `cookiePathRewrite: "/newPath/"`. To remove the path, use `cookiePathRewrite: ""`. To set path to root use `cookiePathRewrite: "/"`.
   * Object: mapping of paths to new paths, use `"*"` to match all paths.
     For example, to keep one path unchanged, rewrite one path and remove other paths:
     ```
     cookiePathRewrite: {
       "/unchanged.path/": "/unchanged.path/",
       "/old.path/": "/new.path/",
       "*": ""
     }
     ```
*  **headers**: object with extra headers to be added to target requests.
*  **proxyTimeout**: timeout (in millis) for outgoing proxy requests
*  **timeout**: timeout (in millis) for incoming requests
*  **followRedirects**: true/false, Default: false - specify whether you want to follow redirects
*  **selfHandleResponse** true/false, if set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the `proxyRes` event
*  **buffer**: stream of data to send as the request body.  Maybe you have some middleware that consumes the request stream before proxying it on e.g.  If you read the body of a request into a field called 'req.rawbody' you could restream this field in the buffer option:

    ```
    {
        target: 'http://localhost:4003/',
        buffer: streamify(req.rawBody)
    }
    ```

**NOTE:**
`options.ws` and `options.ssl` are optional.
`options.target` and `options.forward` cannot both be missing

If you are using the `proxyServer.listen` method, the following options are also applicable:

 *  **ssl**: object to be passed to https.createServer()
 *  **ws**: true/false, if you want to proxy websockets


 ### Issues

 - [create issues](https://github.com/ranyunlong/longjs/issues)

 ### Contribution

 <a herf="https://github.com/ranyunlong"><img width="148px" src="https://avatars0.githubusercontent.com/u/19652564?s=460&v=4"></a>

 ### License MIT