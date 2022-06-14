import Router from "express-promise-router";

import { query } from "../db";
import { MeterFact } from "../../shared/types";

const router = Router();

router.get("/", async (req, res) => {
  const now = Date.now();

  const limit = new Date(now);

  console.log("SELECT", [
    req.query.meter,
    req.query.units,
    limit.getFullYear(),
    limit.getMonth() + 1,
    limit.getDate()
  ]);
  const { rows } = await query<MeterFact>(
    "SELECT * FROM meter_facts \
INNER JOIN date_dim ON meter_facts.dateid = date_dim.id \
INNER JOIN time_dim ON meter_facts.timeid = time_dim.id \
WHERE meter = $1 AND units = $2 AND date_dim.year = $3 \
AND date_dim.month = $4 AND date_dim.date = $5 \
ORDER BY hour ASC, minute ASC",
    [
      req.query.meter || req.query.device,
      req.query.units,
      limit.getFullYear(),
      limit.getMonth() + 1,
      limit.getDate()
    ]
  );

  res.status(200).json(rows);
});

export default router;
