import { Wyze } from "./wyze";
import process from "process";

const { API_KEY, KEY_ID, PASSWORD, USERNAME } = process.env;

const WYZE = new Wyze({keyid: KEY_ID, apikey: API_KEY});

test("login", async () => {
  return await WYZE.login(USERNAME, PASSWORD);
});

test("refresh token", async () => {
  return await WYZE.get_refresh_token();
});

test("get object list", async () => {
  return await WYZE.get_object_list();
});
