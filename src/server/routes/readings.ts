import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const now = Date.now();
  let limit = now - 180000;
  console.log("NOW NOW NOW", now, "NOW NOW NOW");
  console.log(new Date(now));
  console.log(new Date(limit));
  const bday = new Date(1974, 6, 21);
  console.log(bday);
  if (req.query.last === "hour") {
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
