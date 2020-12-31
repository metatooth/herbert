import * as WebSocket from 'ws';
import * as http from 'http';
import * as express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

const server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);

const wss = new WebSocket.Server({server: server});
console.log('websocket server created');

let sockets: WebSocket[] = [];
wss.on('connection', function(socket: WebSocket) {
    console.log('websocket connection open');
    sockets.push(socket);

    // When you receive a message, send that message to every socket.
    socket.on('message', function(msg: string) {
        console.log(msg);
        sockets.forEach(s => s.send(msg));
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});
