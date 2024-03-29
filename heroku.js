const role = process.env.ROLE || "client";

if (role === "client") {
  const express = require("express");
  const app = express();
  const port = process.env.CLIENT_PORT || process.env.PORT;

  app.use(express.static("dist/client"));

  app.listen(port, () => {
    console.log(`Herbert ${role} listing at ${port}`);
  });
} else if (role === "socket-server") {
  process.env.WSS_PORT = process.env.PORT;
  console.log(`Herbert Socket Server listening on ${process.env.WSS_PORT}`);
  require("./dist/socket-server/main");
} else {
  process.env.API_PORT = process.env.PORT;
  console.log(`Herbert Server listening on ${process.env.API_PORT}`);
  console.log("trivial change");
  require("./dist/server/main");
}
