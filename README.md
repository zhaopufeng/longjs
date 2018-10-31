# @longjs/session

[![npm (scoped)](https://img.shields.io/npm/v/@longjs/session.svg)](https://www.npmjs.com/package/@longjs/session)


### Introduction

The module based on @longjs/core, used for HTTP session.


### Use

```shell
> yarn add @longjs/session
```
or 

```shell
> npm install @longjs/session
```

### Examples

```ts
import Server from '@longjs/core'
import Session from '@longjs/session'

new Server({
    port: 3000,
    plugins: [
        new Session({

        })
    ]
})
```

### Api

#### Options
## Options

Most options based on [cookies](https://github.com/pillarjs/cookies#cookiesset-name--value---options--)

- `key`: a string for store session id in cookie
- `store`: a class for custom store (extend {Store}, func: #get(sid), #set(session, opts), #destory(sid))

- `maxAge`: a number representing the milliseconds from `Date.now()` for expiry
- `expires`: a `Date` object indicating the cookie's expiration date (expires at the end of session by default).
- `path`: a string indicating the path of the cookie (`/` by default).
- `domain`: a string indicating the domain of the cookie (no default).
- `secure`: a boolean indicating whether the cookie is only to be sent over HTTPS (`false` by default for HTTP, `true` by default for HTTPS).
- `httpOnly`: a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (`true` by default).
- `signed`: a boolean indicating whether the cookie is to be signed (`false` by default). If this is true, another cookie of the same name with the `.sig` suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of _cookie-name_=_cookie-value_ against the first [Keygrip](https://www.npmjs.com/package/keygrip) key. This signature key is used to detect tampering the next time a cookie is received.
- `overwrite`: a boolean indicating whether to overwrite previously set cookies of the same name (`false` by default). If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.

### Issues

 - [create issues](https://github.com/ranyunlong/longjs/issues)

### Contribution

 <a href="https://github.com/ranyunlong"><img width="50px" src="https://avatars0.githubusercontent.com/u/19652564?s=460&v=4"></a>

### License MIT