import { Server } from "socket.io";
import { SocketMessageMap } from "../shared/types";
import { HerbertSocket } from "./socket";

const port = process.env.WSS_PORT || "2929";
const ioServer = new Server<SocketMessageMap>({ cors: { origin: "*" } });
const herbertSocket = new HerbertSocket(ioServer);
herbertSocket.listen(port);
