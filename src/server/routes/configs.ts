import Router from "express-promise-router";
import { Config } from "../../shared/types";
import { query, readConfig } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query<Config>(
    "SELECT * FROM worker_config ORDER BY nickname",
    []
  );
  res.status(200).json(rows);
});

router.get("/:name", async (req, res) => {
  const { name } = req.params;
  res.status(200).json(await readConfig(name));
});

router.post("/", async (req, res) => {
  const { nickname, config } = req.body;
  await query<Config>(
    "INSERT INTO worker_config (nickname, config) VALUES ($1, $2)",
    [nickname, JSON.stringify(config)]
  )
  const updatedConfig = await readConfig(nickname);
  return res.status(200).json(updatedConfig);
});

router.put("/:name", async (req, res) => {
  const { name } = req.params;
  const { nickname, config } = req.body;

  const { rows } = await query<Config>(
    `UPDATE worker_config
    SET nickname = $1,
    config = $2,
    updatedat = CURRENT_TIMESTAMP
    WHERE nickname = $3`,
    [nickname, config, name]
  );
  res.status(200).json(rows[0])
});

export default router;