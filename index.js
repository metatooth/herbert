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
  process.env.API_PORT = process.env.PORT;
  require("./dist/socket-server/main");
} else {
  process.env.API_PORT = process.env.PORT;
  require("./dist/server/main");
}
