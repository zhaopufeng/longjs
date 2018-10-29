import { Server } from '@longjs/server';
import * as captcha from 'svg-captcha';
export class CaptchaService {
    public session: any;
    constructor(ctx: Server.Context, configs: Server.Configs) {
        this.session = ctx.session
    }
    public create(size: number = 4, noise: number = 5, color: boolean = true): captcha.CaptchaObj {
        const data = captcha.create({
            size,
            noise,
            color
        })
        this.session.captcha = data.text
        return data
    }
}