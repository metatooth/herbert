import Router from "express-promise-router";
import { Zone } from "../../shared/types";

import { query, readZones, readZone } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await readZones();
  res.status(200).json(rows);
});

router.post("/", async (req, res) => {
  const { rows } = await query<Zone>(
    "INSERT INTO zones (nickname, profileid, maxirrigators, lamponleafdiff, lampoffleafdiff) VALUES ($1, $2, 3, 0, 0) RETURNING id",
    [req.body.nickname, req.body.profileid]
  );
  const zone = await readZone(rows[0].id);
  res.status(201).json(zone);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readZone(parseInt(id)));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { rows } = await query<Zone>(
    "UPDATE zones SET nickname = $1, profileid = $2, active = $3, maxirrigators = $4, lamponleafdiff = $5, lampoffleafdiff= $6, updatedat = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id",
    [
      req.body.nickname,
      req.body.profileid,
      req.body.active,
      req.body.maxirrigators,
      req.body.lamponleafdiff,
      req.body.lampoffleafdiff,
      id
    ]
  );

  const devices = [];

  req.body.devices.forEach(device => {
    if (typeof device === "string") {
      devices.push(device);
    } else if (typeof device === "object") {
      devices.push(device.device);
    }
  });

  req.body.meters.forEach(meter => {
    if (typeof meter === "string") {
      devices.push(meter);
    } else if (typeof meter === "object") {
      devices.push(meter.device);
    }
  });

  await query<Record<string, number>>(
    "DELETE FROM zone_devices WHERE zoneid = $1",
    [id]
  );

  devices.forEach(async dev => {
    query<Record<string, number>>(
      "INSERT INTO zone_devices (zoneid, device) VALUES ($1, $2)",
      [id, dev]
    );
  });

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
  console.log("ZONE", id, "DEVICE", req.body.device);
  try {
    await query("INSERT INTO zone_devices (zoneid, device) VALUES ($1, $2)", [
      id,
      req.body.device
    ]);
  } catch (err) {
    console.log("ERROR", err);
  }

  res.status(200).json(await readZone(parseInt(id)));
});

router.delete("/:id/devices/:device", async (req, res) => {
  const { id, device } = req.params;
  await query("DELETE FROM zone_devices WHERE zoneid = $1 AND device = $2", [
    id,
    device
  ]);
  res.status(204).json({});
});

router.post("/:id/children", async (req, res) => {
  const { id } = req.params;
  await query("INSERT INTO edges (a, b) VALUES ($1, $2)", [id, req.body.child]);

  res.status(200).json(await readZone(parseInt(id)));
});

router.delete("/:id/children/:child", async (req, res) => {
  const { id, child } = req.params;
  await query("DELETE FROM edges WHERE a = $1 AND b = $2", [id, child]);
  res.status(204).json({});
});

export default router;
