import Router from "express-promise-router";
import { query, readAccount } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const account = await readAccount(1);
  res.status(200).json(account);
});

router.put("/", async (req, res) => {
  console.log("PUT /settings", req.body);

  if (Object.keys(req.body.logo).length !== 0) {
    const arr = req.body.logo.split(",");
    console.log("TITLE", req.body.title);
    console.log("IMAGE", arr[0]);
    console.log("DATA", arr[1]);
    await query(
      "UPDATE accounts SET units = $1, refresh = $2, timeout = $3, interval = $4, locale = $5, timezone = $6, title = $7, logo = decode($8, 'base64'), openweather = $9, cityname = $10, statecode = $11, reportingperiod = $12, pin = $13, updatedat = CURRENT_TIMESTAMP, deleted = false WHERE id = 1",
      [
        req.body.units,
        req.body.refresh,
        req.body.timeout,
        req.body.interval,
        req.body.locale,
        req.body.timezone,
        req.body.title || "",
        arr[1],
        req.body.openweather,
        req.body.cityname,
        req.body.statecode,
        req.body.reportingperiod,
        req.body.pin
      ]
    );
  } else {
    await query(
      "UPDATE accounts SET units = $1, refresh = $2, timeout = $3, interval = $4, locale = $5, timezone = $6, title = $7, openweather = $8, cityname = $9, statecode = $10, reportingperiod = $11, pin = $12, updatedat = CURRENT_TIMESTAMP, deleted = false WHERE id = 1",
      [
        req.body.units,
        req.body.refresh,
        req.body.timeout,
        req.body.interval,
        req.body.locale,
        req.body.timezone,
        req.body.title,
        req.body.openweather,
        req.body.cityname,
        req.body.statecode,
        req.body.reportingperiod,
        req.body.pin
      ]
    );
  }

  const { rows } = await query("SELECT * FROM accounts WHERE id = $1", [1]);
  res.status(200).json(rows[0]);
});

export default router;
