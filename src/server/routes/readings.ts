import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  let limit;
  const now = Date.now();
  if (req.query.last === "hour") {
    limit = now - 60 * 60 * 1000;
  } else if (req.query.last === "day") {
    limit = now - 24 * 60 * 60 * 1000;
  } else if (req.query.last === "week") {
    limit = now - 7 * 24 * 60 * 60 * 1000;
  } else if (req.query.last === "month") {
    limit = now - 30 * 24 * 60 * 60 * 1000;
  } else {
    limit = now - 365 * 24 * 60 * 60 * 1000;
  }

  const start = new Date(limit).toISOString();
  console.log(req.query.last, "gave us", limit, "and", start);
  if (req.query.meter) {
    const {
      rows
    } = await query(
      "SELECT * FROM readings WHERE meter = $1 AND created_at > $2 ORDER BY id DESC",
      [req.query.meter, start]
    );
    res.status(200).json(rows);
  } else {
    const {
      rows
    } = await query(
      "SELECT * FROM readings WHERE created_at > $1 ORDER BY id DESC",
      [start]
    );
    res.status(200).json(rows);
  }
});

export default router;
