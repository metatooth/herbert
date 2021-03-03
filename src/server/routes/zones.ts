import Router from "express-promise-router";

import { query, readZones, readZone } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await readZones();
  res.status(200).json(rows);
});

router.post("/", async (req, res) => {
  const {
    rows
  } = await query(
    "INSERT INTO zones (nickname, profile_id, parent_id) VALUES ($1, $2, $3) RETURNING id",
    [req.body.nickname, req.body.profile, req.body.parent]
  );
  const zone = await readZone(rows[0].id);
  res.status(201).json(zone);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readZone(id));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    rows
  } = await query(
    "UPDATE zones SET parent_id = $1, nickname = $2, profile_id = $3 WHERE id = $4 returning id",
    [req.body.parentId, req.body.nickname, req.body.profileId, id]
  );
  console.log("update zones", rows);
  const zone = await readZone(rows[0].id);
  res.status(200).json(zone);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("DELETE FROM zones WHERE id = $1", [id]);
  res.status(204).json({});
});

export default router;
