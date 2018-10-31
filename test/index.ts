import Server from '../src'
import { BodyParser } from './plugins/BodyParser';
import { Session } from './plugins/Session';

new Server({
    port: 8000,
    host: 'localhost',
    plugins: [
        new BodyParser(),
        new Session()
    ]
})