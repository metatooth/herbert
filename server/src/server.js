"use strict";
exports.__esModule = true;
var WebSocket = require("ws");
var http = require("http");
var express = require("express");
var meter_reading_1 = require("./meter-reading");
var app = express();
var port = process.env.PORT || 5000;
app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);
var wss = new WebSocket.Server({ server: server });
console.log("websocket server created");
var reading = new meter_reading_1.MeterReading('readings.db');
var sockets = [];
wss.on("connection", function (socket) {
    console.log("websocket connection open");
    sockets.push(socket);
    socket.on("message", function (msg) {
        var data = JSON.parse(msg);
        console.log('message', data);
        if (data.temperature) {
            reading.track(data.id, data.temperature, data.humidity);
        }
        sockets.forEach(function (s) { return s.send(msg); });
    });
    socket.on("close", function () {
        sockets = sockets.filter(function (s) { return s !== socket; });
    });
});
//# sourceMappingURL=server.js.map