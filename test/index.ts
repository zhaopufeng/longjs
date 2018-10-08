import TKServer, { Core } from '../src'
import * as http from 'http'

const app = new TKServer({
    async beforeRequest() {
        return;
    },
    async requested() {
        return;
    },
    async beforeResponse() {
        return;
    },
    async responsed() {
        return;
    }
})

http.createServer(app.callback()).listen(3000)