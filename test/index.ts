import TKServer from '../src'
import * as http from 'http'

const app = new TKServer({
    async beforeRequest(ctx) {
        console.log(ctx.session)
        if (!ctx.session.user) {
            ctx.session.user = Math.random() * 100
        }
        return;
    },
    async requested() {
        return;
    },
    async beforeResponse() {
        return;
    },
    async response(ctx) {
        ctx.body = 'xx'
        return;
    }
})

http.createServer(app.callback()).listen(3000)