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

export async function registerDevice(macaddr, manufacturer, type) {
  query("SELECT * FROM devices WHERE device = $1", [macaddr]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", macaddr);
      query("INSERT INTO devices (device, manufacturer, device_type) VALUES ($1, $2, $3)",
            [macaddr, manufacturer, type]);
    }
  });
}

export async function registerWorker(macaddr, nickname) {
  query("SELECT * FROM workers WHERE worker = $1", [macaddr]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", macaddr);
      query("INSERT INTO workers (worker, nickname) VALUES ($1, $2)",
            [macaddr, nickname]);
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
