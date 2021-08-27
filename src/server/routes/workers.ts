import Router from "express-promise-router";
import { Worker } from "../../shared/types";
import { query, readConfig, readWorker } from "../db";
import { herbertSocket } from "../herbert-socket";

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

  await herbertSocket.sendWorkerConfig(id);
  res.status(200).json(rows[0]);
});

export default router;
