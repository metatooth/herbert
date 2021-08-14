import Router from "express-promise-router";
import { Worker } from "../../shared/types";

import { query, readWorker } from "../db";
import { herbertSocket } from "../socket";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query<Worker>(
    "SELECT * FROM workers ORDER BY createdat DESC",
    []
  );
  res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json(await readWorker(id));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query<Worker>(
    "UPDATE workers SET nickname = $1, config = $2, updatedat = CURRENT_TIMESTAMP WHERE worker = $3 RETURNING worker",
    [req.body.nickname, req.body.config, id]
  );

  const worker = await readWorker(rows[0].worker);
  await herbertSocket.sendWorkerConfig(worker.worker);
  res.status(200).json(worker);
});

export default router;
