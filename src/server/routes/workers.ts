import Router from "express-promise-router";
import { makeSendWorkerConfigMessage } from "../../shared/message-creators";
import { Worker } from "../../shared/types";
import {
  query,
  readConfig,
  readWorker,
  readWorkers,
  registerWorker,
  updateWorker
} from "../db";
import { sendSocketMessage } from "../util";

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json(await readWorkers());
});

router.post("/", async (req, res) => {
  const { body } = req;
  const { device, inet } = body;
  await registerWorker(device, inet);
  res.status(204).send();
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readWorker(id));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  await updateWorker(id);
  res.status(204).send();
});

router.put("/:id/config", async (req, res) => {
  const { id } = req.params;
  const config = await readConfig(req.body.configname);
  const jsonStr = JSON.stringify(config.config);

  const { rows } = await query<Worker>(
    `UPDATE workers
    SET
    nickname = $1,
    configname = $2,
    config = $3,
    updatedat = CURRENT_TIMESTAMP
    WHERE worker = $4
    RETURNING worker`,
    [req.body.nickname, req.body.configname, jsonStr, id]
  );

  sendSocketMessage(makeSendWorkerConfigMessage(id));
  res.status(200).json(await readWorker(rows[0].worker));
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query(
    "UPDATE workers SET deleted = true, deletedat = CURRENT_TIMESTAMP WHERE worker = $1",
    [id]
  );
  res.status(204).json({});
});

export default router;
