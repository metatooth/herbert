import { Pool } from "pg";
const pool = new Pool({
  user: "herbert",
  host: "localhost",
  database: "herbert_development",
  password: "herbert",
  port: 5432
});

export function getReadingsByMeter(request, response) {
  pool.query(
    "SELECT * FROM readings WHERE meter = $1 ORDER BY id DESC",
    [request.params.meter],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
}

export function createReading(meter, temperature, humidity) {
  pool.query(
    "INSERT INTO readings (meter, temperature, humidity) VALUES ($1, $2, $3)",
    [meter, temperature, humidity],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
}
