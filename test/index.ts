import TKServer from '../src'
import * as http from 'http'

const app = new TKServer({
    async beforeRequest(ctx) {
        return;
    },
    async requested() {
        return;
    },
    async beforeResponse() {
        return;
    },
    async response(ctx) {
        return;
    }
})

http.createServer(app.callback()).listen(3000)