import Router from "express-promise-router";
import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query("SELECT * FROM accounts WHERE id = 1", []);
  res.status(200).json(rows[0]);
});

router.put("/", async (req, res) => {
  console.log("PUT /settings", req.body);

  if (req.body.logo) {
    const arr = req.body.logo.split(",");
    console.log("IMAGE", arr[0]);
    console.log("DATA", arr[1]);
    await query(
      "UPDATE accounts SET units = $1, refresh = $2, locale = $3, timezone = $4, title = $5, logo = decode($6, 'base64'), updatedat = CURRENT_TIMESTAMP, deleted = false WHERE id = 1",
      [
        req.body.units,
        req.body.refresh,
        req.body.locale,
        req.body.timezone,
        req.body.title || "",
        arr[1]
      ]
    );
  } else {
    await query(
      "UPDATE accounts SET units = $1, refresh = $2, locale = $3, timezone = $4, title = $5, updatedat = CURRENT_TIMESTAMP, deleted = false WHERE id = 1",
      [
        req.body.units,
        req.body.refresh,
        req.body.locale,
        req.body.timezone,
        req.body.title
      ]
    );
  }

  const { rows } = await query("SELECT * FROM accounts WHERE id = 1", []);
  res.status(200).json(rows[0]);
});

export default router;
