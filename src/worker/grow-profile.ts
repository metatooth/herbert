import { Database } from "sqlite3";

export interface IProfileEntry {
  id: number;
  name: string;
  created_at: string;
  lamps_start: number;
  lamps_duration: number;
  day_time_temperature: number;
  day_time_humidity: number;
  night_time_temperature: number;
  night_time_humidity: number;
  temperature_tolerance: number;
  humidity_tolerance: number;
}

/**
 * A grow phase profile
 */
export class GrowProfile {
  initialized: boolean;
  path: string;
  db: Database;

  constructor(path: string) {
    this.initialized = false;
    this.path = path;
    this.db = new Database(this.path);
  }

  async init(): Promise<boolean> {
    const db: Database = this.db;
    return new Promise((resolve) => {
      db.get(
        "SELECT id, name, created_at, lamps_start, lamps_duration, day_time_temperature, day_time_humidity, night_time_temperature, night_time_humidity, temperature_tolerance, humidity_tolerance FROM grow_profiles",
        (err: string) => {
          if (err) {
            db.serialize(() => {
              db.run(
                "CREATE TABLE growlogs (id INTEGER PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, name VARCHAR(255) NOT NULL, lamps_start NUMERIC NOT NULL, lamps_duration NUMERIC NOT NULL, day_time_temperature NUMERIC NOT NULL, day_time_humidity NUMERIC NOT NULL, night_time_temperature NUMERIC NOT NULL, night_time_humidity NUMERIC NOT NULL, temperature_tolerance NUMERIC NOT NULL, humidity_tolerance NUMERIC NOT NULL)"
              );
            });
          }
          resolve(true);
        }
      );
    });
  }

  async create(entry: IProfileEntry): Promise<boolean> {
    await this.init();

    const db = this.db;

    return new Promise((resolve) => {
      db.serialize(function () {
        const stmt = db.prepare(
          "INSERT INTO grow_profiles (name, lamps_start, lamps_duration, day_time_temperature, day_time_humidity, night_time_temperature, night_time_humidity, temperature_tolerance, humidity_tolerance) VALUES (?, ?, ?)"
        );
        stmt.run(
          entry.name,
          entry.lamps_start,
          entry.lamps_duration,
          entry.day_time_temperature,
          entry.day_time_humidity,
          entry.night_time_temperature,
          entry.night_time_humidity,
          entry.temperature_tolerance,
          entry.humidity_tolerance
        );
        resolve(true);
      });
    });
  }

  async log(pageno: number, pagesize: number): Promise<[unknown, unknown]> {
    await this.init();

    let sql =
      "SELECT id, created_at, name, lamps_start, lamps_duration, day_time_temperature, day_time_humidity, night_time_temperature, night_time_humidity, temperature_tolerance, humidity_tolerance FROM grow_profiles ORDER BY id DESC";
    if (pageno !== 0) {
      sql += " LIMIT " + (pageno - 1) * pagesize + ", " + pagesize;
    }

    const sqlcount = "SELECT count(*) as count FROM grow_profiles";

    const db = this.db;

    const p1 = new Promise(function (resolve, reject) {
      db.all(sql, function (err: Error, rows: IProfileEntry[]) {
        if (err) {
          reject(err);
        } else {
          const data: Array<IProfileEntry> = [];
          rows.forEach((row: IProfileEntry) => {
            data.push(row);
          });
          resolve(data);
        }
      });
    });

    const p2 = new Promise(function (resolve, reject) {
      db.each(sqlcount, (err: string, row: Record<string, unknown>) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });

    return Promise.all([p1, p2]);
  }
}
