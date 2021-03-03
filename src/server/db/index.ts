import { Pool, Result } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query(text, params): Promise<Result> {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
}

export async function readProfile(id) {
  const {
    rows
  } = await query(
    "SELECT id, profile, lamp_start, lamp_duration, lamp_on_temperature, lamp_on_humidity, lamp_off_temperature, lamp_off_humidity, updated_at FROM profiles WHERE id = $1",
    [id]
  );
  return rows[0];
}

export async function readZones() {
  const { rows } = await query(
    "SELECT z.id, z.nickname, b.id as parent_id, b.nickname as parent, p.id as profile_id, p.profile, z.updated_at FROM zones z LEFT JOIN zones b ON z.parent_id = b.id LEFT JOIN profiles p ON z.profile_id = p.id WHERE z.deleted <> true",
    []
  );
  return rows;
}

export async function readZone(id) {
  const {
    rows
  } = await query(
    "SELECT z.id, z.nickname, b.id as parent_id, b.nickname as parent, p.id as profile_id, p.profile, z.updated_at FROM zones z LEFT JOIN zones b ON z.parent_id = b.id LEFT JOIN profiles p ON z.profile_id = p.id WHERE z.id = $1",
    [id]
  );
  const { children } = await query("SELECT * FROM zones WHERE parent_id = $1", [
    rows[0].id
  ]);
  rows[0].children = children;
  return rows[0];
}

export async function readDevice(id) {
  const { rows } = await query("SELECT * FROM devices WHERE device = $1", [id]);
  return rows[0];
}

export async function registerDevice(macaddr, manufacturer, type) {
  query("SELECT * FROM devices WHERE device = $1", [macaddr]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", macaddr);
      query(
        "INSERT INTO devices (device, manufacturer, device_type) VALUES ($1, $2, $3)",
        [macaddr, manufacturer, type]
      );
    }
  });
}

export async function registerWorker(macaddr, nickname) {
  query("SELECT * FROM workers WHERE worker = $1", [macaddr]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", macaddr);
      query("INSERT INTO workers (worker, nickname) VALUES ($1, $2)", [
        macaddr,
        nickname
      ]);
    }
  });
}

export async function createReading(meter, temperature, humidity, pressure) {
  query("SELECT * FROM devices WHERE device = $1", [meter]).then(res => {
    if (res.rowCount !== 0) {
      query(
        "INSERT INTO readings (meter, temperature, humidity, pressure) VALUES ($1, $2, $3, $4)",
        [meter, temperature, humidity, pressure]
      );
    }
  });
}
