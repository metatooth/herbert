import Router from "express-promise-router";

import { query, readZones, readZone } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await readZones();
  console.log("ROWS FOR /zones", rows);
  res.status(200).json(rows);
});

router.post("/", async (req, res) => {
  console.log("POST /ZONES", req, res);
  const {
    rows
  } = await query(
    "INSERT INTO zones (nickname, profileid) VALUES ($1, $2) RETURNING id",
    [req.body.nickname, req.body.profileid]
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
    "UPDATE zones SET nickname = $1, profileid = $2 WHERE id = $3 RETURNING id",
    [req.body.nickname, req.body.profileid, id]
  );
  console.log("update zones", rows);
  const zone = await readZone(rows[0].id);
  res.status(200).json(zone);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM zones WHERE id = $1", [id]);
  res.status(204).json({});
});

router.post("/:id/devices", async (req, res) => {
  const { id } = req.params;
  console.log("POST zone & device", id);
  console.log("BODY", req.body);
  try {
    await query("INSERT INTO zone_devices (zoneid, device) VALUES ($1, $2)", [
      id,
      req.body.device
    ]);
  } catch (err) {
    console.log("ERROR", err);
  }

  const { rows } = await query("SELECT * FROM zone_devices WHERE zoneid = $1", [
    id
  ]);
  console.log("ROWS", rows);
  res.status(200).json({});
});

router.delete("/:id/devices/:device", async (req, res) => {
  const { id, device } = req.params;
  await query("DELETE FROM zone_devices WHERE zoneid = $1 AND device = $2", [
    id,
    device
  ]);
  res.status(204).json({});
});

export default router;
