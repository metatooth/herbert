import clients from "./clients";
import devices from "./devices";
import profiles from "./profiles";
import readings from "./readings";

export default app => {
  app.use("/clients", clients);
  app.use("/devices", devices);
  app.use("/profiles", profiles);
  app.use("/readings", readings);
};
