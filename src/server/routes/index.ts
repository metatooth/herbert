import workers from "./workers";
import devices from "./devices";
import profiles from "./profiles";
import readings from "./readings";
import zones from "./zones";

export default app => {
  app.use("/workers", workers);
  app.use("/devices", devices);
  app.use("/profiles", profiles);
  app.use("/readings", readings);
  app.use("/zones", zones);
};
