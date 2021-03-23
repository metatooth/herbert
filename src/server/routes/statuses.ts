import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const now = Date.now();
  let limit = now - 180000;
  let one = false;

  if (req.query.last === "one") {
    one = true;
  } else if (req.query.last === "hour") {
    limit = now - 3600000;
  } else if (req.query.last === "day") {
    limit = now - 86400000;
  } else if (req.query.last === "week") {
    limit = now - 7 * 86400000;
  } else if (req.query.last === "month") {
    limit = now - 30 * 86400000;
  } else if (req.query.last === "year") {
    limit = now - 365 * 86400000;
  } else if (req.query.last) {
    limit = now - parseInt(req.query.last as string);
  }

  const startDate = new Date(limit);
  console.log("startDate", startDate);

  const start = startDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  if (one) {
    const {
      rows
    } = await query(
      "SELECT * FROM statuses WHERE device = $1 ORDER BY id DESC LIMIT 1",
      [req.query.device]
    );
    res.status(200).json(rows[0]);
  } else if (req.query.device) {
    const {
      rows
    } = await query(
      "SELECT * FROM statuses WHERE device = $1 AND createdat > $2 ORDER BY id DESC",
      [req.query.device, start]
    );
    res.status(200).json(rows);
  } else {
    const {
      rows
    } = await query(
      "SELECT * FROM statuses WHERE createdat > $1 ORDER BY id DESC",
      [start]
    );
    res.status(200).json(rows);
  }
});

export default router;
