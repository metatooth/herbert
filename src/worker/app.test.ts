import { App } from "./app";
import * as WebSocket from "ws";
import { Meter } from "./meter";

let server: WebSocket.Server;

beforeEach(() => {
  server = new WebSocket.Server({
    port: 5000
  });
});

afterEach(() => {
  server.close();
});

test("does run", () => {
  const app = App.instance();
  app.run().then((data: boolean) => {
    expect(data).toBe(true);
    app.stop();
  });
});

test("successfully initializes", () => {
  const app = App.instance();
  app.meters = [new Meter("someid", "Switchbot")];

  return app.init().then((data: boolean) => {
    expect(data).toBe(true);
    app.stop();
  });
});
