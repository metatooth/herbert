process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { App } from './app';

import * as http from 'http';
import * as express from 'express';

const app = express();
const port = process.env.PORT || 4300;

app.use(express.static(__dirname + '/'));

const server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);

(async () => {
    const app = App.instance();
    app.run();
})();
