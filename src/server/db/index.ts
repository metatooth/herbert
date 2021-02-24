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

export async function register(client, main, intake, profile) {
  query("SELECT * FROM clients WHERE client = $1", [client]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", { client });
      query("INSERT INTO clients (client) VALUES ($1)", [client]);
    } else {
      if (main) {
        query(
          "UPDATE clients SET main = $1, updated_at = CURRENT_TIMESTAMP WHERE client = $2",
          [main, client]
        );
      }

      if (intake) {
        query(
          "UPDATE clients SET intake = $1, updated_at = CURRENT_TIMESTAMP WHERE client = $2",
          [intake, client]
        );
      }

      if (profile) {
        query(
          "UPDATE clients SET profile = $1, updated_at = CURRENT_TIMESTAMP WHERE client = $2",
          [profile, client]
        );
      }
    }
  });
}

export async function status(meter, type, temperature, humidity, pressure) {
  if (meter) {
    query("SELECT * FROM devices WHERE device = $1", [meter]).then(res => {
      if (res.rowCount === 0) {
        query(
          "INSERT INTO devices (device, device_type, manufacturer, macaddr) VALUES ($1, $2, 'SwitchBot', $3)",
          [meter, type, meter]
        );
      } else {
        query(
          "INSERT INTO readings (meter, temperature, humidity, pressure) VALUES ($1, $2, $3, $4)",
          [meter, temperature, humidity, pressure]
        );
      }
    });
  }
}
