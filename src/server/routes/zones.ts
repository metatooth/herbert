import Router from "express-promise-router";

import { query } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    "SELECT z.id, z.nickname, p.profile FROM zones z LEFT JOIN profiles p ON z.profile_id = p.id",
    []
  );
  res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("SELECT * FROM zones WHERE zone = $1", [id]);
  res.status(200).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const parent = parseInt(req.query.parent as string);
  const nickname = req.query.nickname as string;
  const profile = parseInt(req.query.profile as string);
  const {
    rows
  } = await query(
    "UPDATE zones SET parent_id = $1, nickname = $2, profile_id = $3 WHERE zone = $4",
    [parent, nickname, profile, id]
  );
  res.status(200).json(rows[0]);
});

export default router;
