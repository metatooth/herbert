import { Database } from "sqlite3";

export interface IMeterReadingEntry {
  id: number;
  timestamp: Date;
  meter: string;
  temperature: number;
  humidity: number;
}

/**
 * Meter readings
 */
export class MeterReading {
  db: Database;
  initialized: boolean;
  path: string;

  constructor(path: string) {
    this.path = path;
    this.db = new Database(this.path);
  }

  async init(): Promise<boolean> {
    const db: Database = this.db;
    return new Promise(resolve => {
      db.get(
        "SELECT id, timestamp, meter, temperature, humidity FROM meter_readings",
        (err: string) => {
          if (err) {
            db.serialize(() => {
              db.run(
                "CREATE TABLE meter_readings (id INTEGER PRIMARY KEY, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, meter VARCHAR(255) NOT NULL, temperature NUMERIC NOT NULL, humidity NUMERIC NOT NULL)"
              );
            });
          }
          resolve(true);
        }
      );
    });
  }

  async track(meter: string, temp: number, humidity: number): Promise<boolean> {
    await this.init();

    const db = this.db;

    return new Promise(resolve => {
      db.serialize(function() {
        const stmt = db.prepare(
          "INSERT INTO meter_readings (meter, temperature, humidity) VALUES (?, ?, ?)"
        );
        stmt.run(meter, temp, humidity);
        resolve(true);
      });
    });
  }

  async log(meter: string, span: number): Promise<any> {
    await this.init();

    const now = Date.now();
    console.log(now);
    const limit = now - (span * 60 * 60);
    console.log(limit);
    
    let sql =
      "SELECT id, timestamp, meter, temperature, humidity FROM meter_readings";
    sql += " WHERE meter = '" + meter + "' AND timestamp > " + limit;
    sql += " ORDER BY id DESC";

    const db = this.db;

    return new Promise(function(resolve, reject) {
      db.all(sql, function(err: Error, rows: IMeterReadingEntry[]) {
        if (err) {
          reject(err);
        } else {
          const data: Array<IMeterReadingEntry> = [];
          rows.forEach((row: IMeterReadingEntry) => {
            data.push(row);
          });
          resolve(data);
        }
      });
    });
  }
}
