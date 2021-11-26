import Router from "express-promise-router";
import { Profile } from "../../shared/types";

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
  const { rows } = await query<Profile>(
    "INSERT INTO profiles (profile, lampstart, lampduration, lampontemperature, lamponhumidity, lampofftemperature, lampoffhumidity, bloweractive, blowercycle, irrigationperday, irrigationduration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
    [
      req.body.profile,
      req.body.lampstart,
      `${req.body.lampduration.hours} hours`,
      req.body.lampontemperature,
      req.body.lamponhumidity,
      req.body.lampofftemperature,
      req.body.lampoffhumidity,
      req.body.bloweractive,
      req.body.blowercycle,
      req.body.irrigationperday,
      req.body.irrigationduration
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
  const { rows } = await query<Profile>(
    "UPDATE profiles SET profile = $1, lampstart = $2, lampduration = $3, lampontemperature = $4, lamponhumidity = $5, lampofftemperature = $6, lampoffhumidity = $7, bloweractive = $8, blowercycle = $9, irrigationperday = $10, irrigationduration = $11, controltype = $12 WHERE id = $13 returning id",
    [
      req.body.profile,
      req.body.lampstart,
      req.body.lampduration,
      req.body.lampontemperature,
      req.body.lamponhumidity,
      req.body.lampofftemperature,
      req.body.lampoffhumidity,
      req.body.bloweractive,
      req.body.blowercycle,
      req.body.irrigationperday,
      req.body.irrigationduration,
      req.body.controltype,
      id
    ]
  );
  console.log("update profiles", rows);
  const profile = await readProfile(rows[0].id);
  res.status(200).json(profile);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query(
    "UPDATE profiles SET deleted = true, deletedat = CURRENT_TIMESTAMP WHERE id = $1",
    [id]
  );
  res.status(204).json({});
});

export default router;
