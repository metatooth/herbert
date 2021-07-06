const role = process.env.ROLE || "client";

if (role === "client") {
  const express = require("express");
  const app = express();
  const port = process.env.PORT || "8080";

  app.use(express.static("dist/client"));

  app.listen(port, () => {
    console.log(`Herbert ${role} listing at ${port}`);
  });
} else {
  require("./dist/server/main");
}
