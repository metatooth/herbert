import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM workers ORDER BY created_at DESC",
    []
  );
  res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("SELECT * FROM workers WHERE worker = $1", [id]);
  res.status(200).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const nickname = req.query.nickname as string;
  const {
    rows
  } = await query("UPDATE workers SET nickname = $1 WHERE worker = $2", [
    nickname,
    id
  ]);
  res.status(200).json(rows[0]);
});

export default router;
