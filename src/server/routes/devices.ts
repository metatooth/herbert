import Router from "express-promise-router";

import { query, readDevice } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query("SELECT * FROM devices", []);
  res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readDevice(id));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("PUT DEVICE", id, "WITH", req.body);
  const {
    rows
  } = await query(
    "UPDATE devices SET nickname = $1, devicetype = $2 WHERE device = $3 RETURNING device",
    [req.body.nickname, req.body.devicetype, id]
  );
  console.log("UPDATED DEVICES", rows);
  const device = await readDevice(rows[0].device);
  console.log("DEVICE", device);
  res.status(200).json(device);
});

export default router;
