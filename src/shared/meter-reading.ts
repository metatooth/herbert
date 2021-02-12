import postgres from "postgres";

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
  url: string;
  initialized: boolean;

  constructor(url: string) {
    this.url = url;
  }

  async init(): Promise<boolean> {
    const sql = postgres(this.url);
    console.log("sql", sql);
    const readings = await sql`SELECT id, timestamp, meter, temperature, humidity FROM meter_readings`;
    console.log("readings", readings);

    return new Promise(resolve => {
      resolve(true);
    });
  }

  async track(meter: string, temp: number, humidity: number): Promise<boolean> {
    return new Promise(resolve => {
      resolve(true);
    });
  }

  async log(meter: string, length: number): Promise<boolean> {
    return new Promise(resolve => {
      resolve(true);
    });
  }
}

/**
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

  async log(pageno: number, pagesize: number): Promise<[any, any]> {
    await this.init();

    let sql =
      "SELECT id, timestamp, meter, temperature, humidity FROM meter_readings ORDER BY id DESC";
    if (pageno !== 0) {
      sql += " LIMIT " + (pageno - 1) * pagesize + ", " + pagesize;
    }

    const sqlcount = "SELECT count(*) as count FROM meter_readings";

    const db = this.db;

    const p1 = new Promise(function(resolve, reject) {
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

    const p2 = new Promise(function(resolve, reject) {
      db.each(sqlcount, (err: string, row: [string, any]) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    return Promise.all([p1, p2]);
  }
}
*/
