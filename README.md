# @longjs/core

[![npm (scoped)](https://img.shields.io/npm/v/@longjs/core.svg)](https://www.npmjs.com/package/@longjs/core)

### Introduction

@longjs/core is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with TypeScript (preserves compatibility with pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

### Installation

```shell
> yarn add @longjs/core
```

or

```shell
> npm install @longjs/core
```

### Use

```ts
import Server from '@longjs/core'

new Server({}) 
```
Server(options: Options)

#### 1. options
- port?: number;
- host?: string;
- configs?: Configs;   
- keys?: Keygrip | string[]; 
- env?: Env;   
- proxy?: boolean; defalut false
- subdomainOffset?: number; defalut 2
- silent?: boolean;
- plugins?: Plugins;
- controllers?: Array<{ new (...args: any[]): any }>;
- routeStrict?: boolean;

### Api 

- listen

listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
listen(port: number, hostname?: string, listeningListener?: () => void): this;
listen(port: number, backlog?: number, listeningListener?: () => void): this;
listen(port: number, listeningListener?: () => void): this;
listen(path: string, backlog?: number, listeningListener?: () => void): this;
listen(path: string, listeningListener?: () => void): this;
listen(options: ListenOptions, listeningListener?: () => void): this;
listen(handle: any, backlog?: number, listeningListener?: () => void): this;
listen(handle: any, listeningListener?: () => void): this;

- getPluginID

getPluginID(pluginConstructor: { new (...args: any[]): any}): string;

return plugin uid

- callback

return (request: IncomingMessage, response: ServerResponse): this;


### Issues

- [create issues](https://github.com/ranyunlong/longjs/issues)

### Contribution

 <a href="https://github.com/ranyunlong"><img width="50px" src="https://avatars0.githubusercontent.com/u/19652564?s=460&v=4"></a>

### License MIT
