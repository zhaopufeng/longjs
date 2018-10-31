# @longjs/decorators

[![npm (scoped)](https://img.shields.io/npm/v/@longjs/decorators.svg)](https://www.npmjs.com/package/@longjs/decorators)

### Introduction

The module based on @longjs/core, used for core decorators.

### Use

```shell
> yarn add @longjs/decorators
```
or

```shell
> npm install @longjs/decorators
```

### decorators

- Controller `class decorator`

```ts
import { Controller } from '@longjs/decorators'

@Controller('/')
export class IndexController {}
```

- Body `Property and parameter decorator`

> Use property decorator

```ts
import { Controller, Body } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Body public body: Body;
    constructor() {
        console.log(this.body)
    }
}
```

> use parameter decorator

```ts
import { Controller, Post, Body } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Post 
    public async test1(@Body body: Body) {
        // Your http request method must be POST
        console.log(body)
    }

    @Post
    public async test2(@Body(['name', 'age']) body: Body) {
        // Your http request method must be POST
        console.log(body)
    }
}
```

- Query `Property and parameter decorator`

    Similar to body decorator

- Session `Property and parameter decorator`

    Similar to body decorator

- Request `Property and parameter decorator`

    Similar to body decorator

- Response `Property and parameter decorator`

    Similar to body decorator

- Params `Property and parameter decorator`

    Similar to body decorator

- Files `Property and parameter decorator`

    Similar to body decorator

- Type `Method decorator`

```ts
import { Controller, Get } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Get
    @Type('json')
    public async test2() {
        // This response type is application/json
        return {
            code: 1
        }
    }
}
```

- Get `Http request method decorator`

```ts
import { Controller, Get } from '@longjs/decorators'

@Controller('/')
export class IndexController {
    @Get('/')
    public async test() {
        return {code: 1}
    }

    @Get
    public async test1() {
        return {code: 1}
    }
}

// test url request `http://localhost:port/`
// test url request `http://localhost:port/test1`
```

- All `Http request method decorator`
    
    Similar to Get decorator

- Delete `Http request method decorator`

    Similar to Get decorator

- Head `Http request method decorator`

    Similar to Get decorator

- Options `Http request method decorator`

    Similar to Get decorator

- Patch `Http request method decorator`

    Similar to Get decorator

- Post `Http request method decorator`

    Similar to Get decorator

- Put `Http request method decorator`

    Similar to Get decorator


### Issues

- [create issues](https://github.com/ranyunlong/longjs/issues)

### Contribution

 <a href="https://github.com/ranyunlong"><img width="50px" src="https://avatars0.githubusercontent.com/u/19652564?s=460&v=4"></a>

### License MIT