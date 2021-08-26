import Router from "express-promise-router";
import WebSocket from "ws";
import { makeCommandMessage } from "../../shared/message-creators";
import { Device } from "../../shared/types";
import { query, readDevice, readDevices } from "../db";
import { herbertSocket } from '../socket';

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json(await readDevices());
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readDevice(id));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query<Device>(
    "UPDATE devices SET nickname = $1, devicetype = $2, updatedat = CURRENT_TIMESTAMP WHERE device = $3 RETURNING device",
    [req.body.nickname, req.body.devicetype, id]
  );
  const device = await readDevice(rows[0].device);
  res.status(201).json(device);
});

router.put("/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  const device = await readDevice(id);
  const cmd = makeCommandMessage({
    device: device.device,
    action: action,
    timestamp: new Date().toString(),
  })
  herbertSocket.sendByDeviceID(device.device, cmd);
  res.status(200);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query(
    "UPDATE devices SET deleted = true, deletedat = CURRENT_TIMESTAMP WHERE device = $1",
    [id]
  );
  res.status(204).json({});
});

export default router;
