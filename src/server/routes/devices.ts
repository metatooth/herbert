import Router from "express-promise-router";
import {
  makeCommandMessage,
  makeSendByDeviceIDMessage
} from "../../shared/message-creators";
import { Device } from "../../shared/types";
import { query, readDevice, readDevices, registerDevice } from "../db";
import { sendSocketMessage } from "../util";

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json(await readDevices());
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readDevice(id));
});

router.post("/", async (req, res) => {
  const { body } = req;
  const { device, manufacturer } = body;
  await registerDevice(device, manufacturer);
  res.status(204).send();
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (req.body.devicetype) {
    await query<Device>(
      "UPDATE devices SET nickname = $1, devicetype = $2, updatedat = CURRENT_TIMESTAMP WHERE device = $3 RETURNING device",
      [req.body.nickname, req.body.devicetype, id]
    );
  } else {
    await query<Device>(
      "UPDATE devices SET nickname = $1, devicetype = null, updatedat = CURRENT_TIMESTAMP WHERE device = $2 RETURNING device",
      [req.body.nickname, id]
    );
  }
  const device = await readDevice(id);
  res.status(201).json(device);
});

router.put("/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  const device = await readDevice(id);
  const cmd = makeCommandMessage({
    device: device.device,
    action: action,
    timestamp: new Date().toString()
  });
  const payload = { device: device.device, msg: cmd };
  sendSocketMessage(makeSendByDeviceIDMessage(payload));
  res.status(204).send();
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
