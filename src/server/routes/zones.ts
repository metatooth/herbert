import Router from "express-promise-router";

import { query, readZones, readZone } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await readZones();
  console.log("ROWS FOR /zones", rows);
  res.status(200).json(rows);
});

router.post("/", async (req, res) => {
  const {
    rows
  } = await query(
    "INSERT INTO zones (nickname, profileid, parentid) VALUES ($1, $2, $3) RETURNING id",
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
    "UPDATE zones SET parentid = $1, nickname = $2, profileid = $3 WHERE id = $4 RETURNING id",
    [req.body.parentid, req.body.nickname, req.body.profileid, id]
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

router.post("/:id/devices", async (req, res) => {
  const { id } = req.params;
  console.log("POST zone & device", id);
  console.log("BODY", req.body);
  try {
    await query("INSERT INTO zone_devices (zoneid, device) VALUES ($1, $2)",
                [id, req.body.device]);
  } catch (err) {
    console.log("ERROR", err);
  }

  const { rows } = await query("SELECT * FROM zone_devices WHERE zoneid = $1",
                               [id]); 
  console.log("ROWS", rows);
  res.status(200).json({});
});

router.delete("/:id/devices/:device", async (req, res) => {
  const { id, device } = req.params;
  console.log("DELETE ", id, device);
  const { rows } = await query("DELETE FROM zone_devices WHERE zoneid = $1 AND device = $2", [id, device]);
  res.status(204).json({});
});

export default router;
