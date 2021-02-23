import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query("SELECT * FROM profiles", []);
  res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("SELECT * FROM profiles WHERE id = $1", [id]);
  res.status(200).json(rows[0]);
});

export default router;
