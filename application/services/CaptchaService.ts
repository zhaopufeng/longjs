import { Server } from '@longjs/server';
import * as captcha from 'svg-captcha';
export class CaptchaService {
    public session: any;
    constructor(public ctx: Server.Context, configs: Server.Configs) {
        this.session = ctx.session
    }
    public create(size: number = 4, noise: number = 2, color: boolean = true): captcha.CaptchaObj {
        this.ctx.type = 'svg'
        const data = captcha.create({
            size,
            noise,
            color
        })
        this.session.captcha = data.text
        return data
    }
}