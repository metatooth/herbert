import Router from "express-promise-router";

import { query, readProfile } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM profiles WHERE deleted <> true",
    []
  );
  res.status(200).json(rows);
});

router.post("/", async (req, res) => {
  const {
    rows
  } = await query(
    "INSERT INTO profiles (profile, lampstart, lampduration, lampontemperature, lamponhumidity, lampofftemperature, lampoffhumidity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    [
      req.body.profile,
      req.body.start,
      req.body.duration + " hours",
      req.body.lampOnTemperature,
      req.body.lampOnHumidity,
      req.body.lampOffTemperature,
      req.body.lampOffHumidity
    ]
  );
  const profile = await readProfile(rows[0].id);
  res.status(201).json(profile);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("SELECT * FROM profiles WHERE id = $1", [id]);
  res.status(200).json(rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("update profile", id, "with", req.body);
  const {
    rows
  } = await query(
    "UPDATE profiles SET profile = $1, lampstart = $2, lampduration = $3, lampontemperature = $4, lamponhumidity = $5, lampofftemperature = $6, lampoffhumidity = $7 WHERE id = $8 returning id",
    [
      req.body.profile,
      req.body.lampstart,
      req.body.lampduration,
      req.body.lampontemperature,
      req.body.lamponhumidity,
      req.body.lampofftemperature,
      req.body.lampoffhumidity,
      id
    ]
  );
  console.log("update profiles", rows);
  const profile = await readProfile(rows[0].id);
  res.status(200).json(profile);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM profiles WHERE id = $1", [id]);
  res.status(204).json({});
});

export default router;
