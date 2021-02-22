import clients from "./clients";
import devices from "./devices";
import readings from "./readings";

export default app => {
  app.use("/clients", clients);
  app.use("/devices", devices);
  app.use("/readings", readings);
};
