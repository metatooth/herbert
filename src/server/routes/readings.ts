import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  if (req.query.meter) {
    const { rows } = await query("SELECT * FROM readings WHERE meter = $1", [
      req.query.meter
    ]);
    res.status(200).json(rows);
  } else {
    const { rows } = await query("SELECT * FROM readings ORDER BY id DESC", []);
    res.status(200).json(rows);
  }
});

export default router;
