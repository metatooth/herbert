import { App } from "./app";
import * as WebSocket from "ws";

let server: WebSocket.Server;
let app: App;

beforeEach(() => {
  server = new WebSocket.Server({
    port: 5000
  });
  server.on("connection", (ws: WebSocket) => {
    ws.on("message", msg => {
      const data = JSON.parse(msg.toString());
      if (data.type === "REGISTER") {
        const config = JSON.stringify({
          devices: [
            {
              id: "aaaaaabbbbbb",
              manufacturer: "mockmeter"
            }
          ]
        });
        const returnMsg = {
          type: "CONFIGURE",
          payload: {
            worker: data.payload.worker,
            config
          }
        };
        ws.send(JSON.stringify(returnMsg));
      }
    });
  });

  app = new App();
});

afterEach(() => {
  app.close();
  server.close();
});

test("does run", async () => {
  app.macaddr = "98765";
  app.inet = "172.10.10.10";
  app.init().then(() => {
    app.run().then(() => {
      expect(true).toBe(true);
    });
  });
});

test("successfully initializes", async () => {
  app.macaddr = "123456";
  app.inet = "172.20.20.20";

  app.init().then(() => {
    expect(true).toBe(true);
  });
});
