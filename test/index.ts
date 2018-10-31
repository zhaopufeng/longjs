import Server from '@longjs/core'
import StaticServer from '@longjs/static'
import Proxy from '@longjs/proxy'
import BodyParser from '@longjs/body-parser'
import Session, { SessionRedisStorage } from '@longjs/session'
import { resolve } from 'path'
import { IndexController } from './controllers/IndexController'

new Server({
    port: 3000,
    controllers: [
        IndexController
    ],
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
        }),
        new Session({
            store: new SessionRedisStorage(),
            key: 'sess:id',
            maxAge: 86400000,
            overwrite: true,
            httpOnly: true,
            signed: true
        }),
        new StaticServer({
            root: resolve('public'),
            maxage: 60000,
            defer: true
        }),
        new BodyParser({
            multipart: true,                // 解析文件上传
            jsonLimit: 1,                   // json请求显示 (mb)
            formLimit: 56,                  // from请求限制 (kb)
            textLimit: 56,                  // text请求限制 (kb)
            text: true,                  // 解析文本
            json: true,                  // 解析json
            encoding: 'utf-8',           // 编码格式
            urlencoded: true,            // 解析urlencoded主体
            jsonStrict: true,            // 严格模式
            strict: true,                // 不解析GET,HEAD,DELETE请求
            formidable: {
                maxFields: 1000,        // 限制查询字符串解析器将解码的字段数
                maxFieldsSize: 2,       // 上传文件大小限制 默认2M
                // uploadDir: '',       // 上传目录
                keepExtensions: false,  // 是否保留原始文件的扩展名
                // hash: 'sha1',        // 如果你想要进入的文件计算校验和，此设置为'sha1'或'md5'默认false
                multiples: true,        // 多个文件上传或否
                // onFileBegin:()=>{}   // Function 文件开始的特殊回调。该功能由强大的直接执行。它可以在将文件保存到磁盘之前用于重命名文件。
            }
        })
    ]
})