import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM clients c LEFT JOIN profiles p ON c.profile_id = p.id",
    []
  );
  res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("SELECT * FROM clients WHERE client = $1", [id]);
  res.status(200).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const pid = parseInt(req.query.profile_id as string);
  const nickname = req.query.nickname as string;
  const {
    rows
  } = await query(
    "UPDATE clients SET nickname = $1, profile_id = $2 WHERE client = $3",
    [nickname, pid, id]
  );
  res.status(200).json(rows[0]);
});

export default router;
