import Router from "express-promise-router";
import { Meter } from "../../shared/types";
import { query, readMeter, readMeters } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json(await readMeters());
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readMeter(id));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query<Meter>(
    "UPDATE devices SET nickname = $1, updatedat = CURRENT_TIMESTAMP WHERE meter = $2 RETURNING meter",
    [req.body.nickname, id]
  );
  const meter = await readMeter(rows[0].device);
  res.status(201).json(meter);
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
