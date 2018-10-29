import { Controller, Get, Session, Database, Post, Body, Query } from '@longjs/decorators'
import { CaptchaService } from '../services/CaptchaService';
import * as Mock from 'mockjs'

@Controller('/')
export class IndexController {
    @Session public session: Session;
    @Database('users') public users: Database;
    constructor(public captchaService: CaptchaService) {}

    @Get('/')
    public async index() {
        return this.session.captcha
    }

    @Get('/captcha.svg')
    public async captcha() {
        return this.captchaService.create().data
    }

    @Get
    public async getusers(@Body body: Body, @Query query: Query) {
        let { page, limit } = query
        if (isNaN(page)) page = 1
        if (isNaN(limit)) limit = 10

        const obj: any = {}
        const start = page * limit
        obj[`data|10`] = [{
            'id|+1': start,
            'number': '@ID',
            'guid': '@guid',
            'name': `@cfirst@clast`,
            'upic': `@image(80x80,@color)`,
            'address': '@province@city@county',
            'create_time': '@date(yyyy-MM-dd)'
        }]
        const data = await Mock.mock(obj)
        return data
    }

    @Post
    public async login(@Body body: Body) {
        const { account, password } = body
        const err: any = {}
        if (!account) {
            err['account'] = '账号不能为空'
        }
        if (!password) {
            err['password'] = '密码不能为空'
        }

        // 验证通过
        if (!Object.keys(err).length) {
            const data = await this.users.where({
                username: account
            }).orWhere({
                email: account
            }).orWhere({
                phone: account
            }).select()

            if (!data.length) {
                err['account'] = '该账号不存在'
                return {
                    code: 0,
                    err: err
                }
            } else {
                const reulst: any = data[0]
                if (reulst.password === password) {
                    delete reulst.password
                    return {
                        code: 1,
                        reulst
                    }
                } else {
                    err['password'] = '密码不正确'
                    return {
                        code: 0,
                        err
                    }
                }
            }
        } else {
            return {
                code: 0,
                err
            }
        }
    }

    @Post
    public async register(@Body body: Body, @Query query: Query) {
        const { username, password, email, phone, verifiy } = body
        const err: any = {}

        if (!username) {
            err['username'] = 'username 不能为空'
        }

        if (!password) {
            err['password'] = 'password 不能为空'
        }

        if (!email) {
            err['email'] = 'email 不能为空'
        }

        if (!phone) {
            err['phone'] = 'phone 不能为空'
        }

        if (!verifiy) {
            err['verifiy'] = 'verifiy 不能为空'
        } else {
            if (verifiy.toLowerCase() !== this.session.captcha.toLowerCase()) {
                err['verifiy'] = '验证码错误，验证失败！'
            }
        }

        if (!Object.keys(err).length) {
            const data = await this.users.where({
                username
            }).orWhere({
                email
            }).orWhere({
                phone
            }).select()

            if (!data.length) {
                const result = await this.users.insert({
                    username,
                    password,
                    phone,
                    email
                })
                return {
                    code: 1,
                    result
                }
            }

            data.forEach((k: any) => {
                if (k.username === username) {
                    err['username'] = 'username 重复'
                }

                if (k.email === email) {
                    err['email'] = 'email 重复'
                }

                if (k.phone === phone) {
                    err['phone'] = 'phone 重复'
                }
            })

            return {
                code: 0,
                err
            }
        } else {
            return {
                code: 0,
                err
            }
        }
    }
}