import { Wyze } from "./wyze";
import process from "process";

const { API_KEY, KEY_ID, PASSWORD, USERNAME } = process.env;

const WYZE = new Wyze({keyid: KEY_ID, apikey: API_KEY});

test("00 login", async () => {
  return await WYZE.login(USERNAME, PASSWORD);
});

test("05 update refresh token", async () => {
  await WYZE.login(USERNAME, PASSWORD);
  return await WYZE.update_refresh_token();
});

test("10 get object list", async () => {
  await WYZE.login(USERNAME, PASSWORD);
  return await WYZE.get_object_list();
});
