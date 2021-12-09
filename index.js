const role = process.env.ROLE || "client";
const port = process.env.PORT;

if (role === "client") {
  const express = require("express");
  const app = express();
  const port = process.env.CLIENT_PORT || port;

  app.use(express.static("dist/client"));

  app.listen(port, () => {
    console.log(`Herbert ${role} listing at ${port}`);
  });
} else if (role === "socket-server") {
  process.env.API_PORT = port;
  require("./dist/socket-server/main");
} else {
  process.env.API_PORT = port;
  require("./dist/server/main");
}
