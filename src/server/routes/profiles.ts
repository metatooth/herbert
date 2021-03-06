import Router from "express-promise-router";

import { query, readProfile } from "../db";
import Time from "os";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM profiles WHERE deleted <> true",
    []
  );
  res.status(200).json(rows);
});

router.post("/", async (req, res) => {
  console.log("POST PROFILE", req.body);
  const start = "08:00";

  const {
    rows
  } = await query(
    "INSERT INTO profiles (profile, lamp_start, lamp_duration, lamp_on_temperature, lamp_on_humidity, lamp_off_temperature, lamp_off_humidity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
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
      req.body.lampStart,
      req.body.lampDuration,
      req.body.lampOnTemperature,
      req.body.lampOnHumidity,
      req.body.lampOffTemperature,
      req.body.lampOffHumidity,
      id
    ]
  );
  console.log("update profiles", rows);
  const profile = await readProfile(rows[0].id);
  res.status(200).json(profile);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query("DELETE FROM profiles WHERE id = $1", [id]);
  res.status(204).json({});
});

export default router;
