# @longjs/body-parser

[![npm (scoped)](https://img.shields.io/npm/v/@longjs/body-parser.svg)](https://www.npmjs.com/package/@longjs/body-parser)

### Introduction

The module based on @longjs/core, used for HTTP parser body.

### Use

```shell
> yarn add @longjs/body-parser
```
or

```shell
> npm install @longjs/body-parser
```

### Examples

```ts
import Server from '@longjs/core'
import BodyParser from '@longjs/body-parser'
new Server({
    port: 3000,
    plugins: [
        new BodyParser({
            multipart: true,
            jsonLimit: 1,
            formLimit: 56, 
            textLimit: 56,
            text: true,
            json: true,
            encoding: 'utf-8', 
            urlencoded: true,
            jsonStrict: true, 
            strict: true, 
            formidable: {
                maxFields: 1000, 
                maxFieldsSize: 2,
                keepExtensions: false, 
                multiples: true
            }
        })
    ]
})
```

### Api

### Options

- `jsonLimit` **{String|Integer}** The byte (if integer) limit of the JSON body, default `1mb`
- `formLimit` **{String|Integer}** The byte (if integer) limit of the form body, default `56kb`
- `textLimit` **{String|Integer}** The byte (if integer) limit of the text body, default `56kb`
- `encoding` **{String}** Sets encoding for incoming form fields, default `utf-8`
- `multipart` **{Boolean}** Parse multipart bodies, default `false`
- `urlencoded` **{Boolean}** Parse urlencoded bodies, default `true`
- `text` **{Boolean}** Parse text bodies, default `true`
- `json` **{Boolean}** Parse json bodies, default `true`
- `jsonStrict` **{Boolean}** Toggles co-body strict mode; if set to true - only parses arrays or objects, default `true`
- `formidable` **{Object}** Options to pass to the formidable multipart parser
- `onError` **{Function}** Custom error handle, if throw an error, you can customize the response - onError(error, context), default will throw
- `strict` **{Boolean}** If enabled, don't parse GET, HEAD, DELETE requests, default `true`

### Issues

- [create issues](https://github.com/ranyunlong/longjs/issues)

### Contribution

 <a href="https://github.com/ranyunlong"><img width="50px" src="https://avatars0.githubusercontent.com/u/19652564?s=460&v=4"></a>

### License MIT