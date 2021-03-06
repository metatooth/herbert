import Router from "express-promise-router";

import { query, readWorker } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM workers ORDER BY createdAt DESC",
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
  const {
    rows
  } = await query(
    "UPDATE workers SET nickname = $1 WHERE worker = $2 RETURNING worker",
    [req.body.nickname, id]
  );

  res.status(200).json(await readWorker(rows[0].worker));
});

export default router;
