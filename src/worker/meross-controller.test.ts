import { MerossController } from "./meross-controller";
import process from "process";
import dotenv from "dotenv";

dotenv.config();

const { MEROSS_EMAIL, MEROSS_PASSWORD } = process.env;

test("00 initialize", async () => {
  const options = {
    email: MEROSS_EMAIL,
    password: MEROSS_PASSWORD,
    logger: console.log,
    localHttpFirst: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const meross = new MerossController(options);

  return;
});
