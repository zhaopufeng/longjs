import TKServer, { Core } from '../src'
import * as http from 'http'

const app = new TKServer({
    async beforeRequest(ctx) {
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
    async responsed(ctx) {
        console.log(ctx.session)
        return;
    }
})

http.createServer(app.callback()).listen(3000)