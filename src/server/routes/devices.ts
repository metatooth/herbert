import Router from "express-promise-router";
import WebSocket from "ws";
import { query, readDevice, readDevices } from "../db";

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
  console.log("PUT DEVICE", id, "WITH", req.body);
  const {
    rows
  } = await query(
    "UPDATE devices SET nickname = $1, devicetype = $2, updatedat = CURRENT_TIMESTAMP WHERE device = $3 RETURNING device",
    [req.body.nickname, req.body.devicetype, id]
  );
  console.log("UPDATED DEVICES", rows);
  const device = await readDevice(rows[0].device);
  console.log("DEVICE", device);
  res.status(201).json(device);
});

router.put("/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  const device = await readDevice(id);

  const url = `ws://localhost:${process.env.PORT || 5000}`;
  const ws = new WebSocket(url);

  ws.addEventListener("open", ev => {
    console.log("event", ev);
    const data = {
      type: "COMMAND",
      payload: {
        device: device.device,
        action: action,
        timestamp: new Date()
      }
    };

    ws.send(JSON.stringify(data));
  });

  res.status(200).json(device);
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
