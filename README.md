# @longjs/static

[![npm (scoped)](https://img.shields.io/npm/v/@longjs/static.svg)](https://www.npmjs.com/package/@longjs/static)

### Introduction

The module based on @longjs/core, used for HTTP static file output.

### Use

```shell
> yarn add @longjs/static
```
or

```shell
> npm add @longjs/static
```

### Examples

```ts
import Server from '@longjs/core'
import StaticServer from '@longjs/static'
// If your want to use redis.
new Server({
    port: 3000,
    plugins: [
        new StaticServer({
            root: resolve('public'),
            maxage: 60000,
            defer: true
        })
    ]
})
```

### Api

### Options

- `maxage` Browser cache max-age in milliseconds. defaults to 0
- `hidden` Allow transfer of hidden files. defaults to false
- `index` Default file name, defaults to 'index.html'
- `defer` If true, serves after `return next()`, allowing any downstream middleware to respond first.
- `gzip`  Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true.
- `br`  Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with .br extension exists (note, that brotli is only accepted over https). defaults to true.
- `setHeaders` Function to set custom headers on response.
- `extensions` Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served. (defaults to `false`)

### setHeaders

The function is called as `fn(res, path, stats)`, where the arguments are:
* `res`: the response object
* `path`: the resolved file path that is being sent
* `stats`: the stats object of the file that is being sent.

You should only use the `setHeaders` option when you wish to edit the `Cache-Control` or `Last-Modified` headers, because doing it before is useless (it's overwritten by `send`), and doing it after is too late because the headers are already sent.

If you want to edit any other header, simply set them before calling `send`.

### Issues

- [create issues](https://github.com/ranyunlong/longjs/issues)

### Contribution

 <a href="https://github.com/ranyunlong"><img width="50px" src="https://avatars0.githubusercontent.com/u/19652564?s=460&v=4"></a>

### License MIT