import sqlite = require('sqlite3');
const sqlite3 = sqlite.verbose();

export interface LogEntry {
    id: number,
    meter: string,
    created_at: string,
    temperature: number,
    relative_humidity: number
}

/**
 * Log growing conditions
 */
export class GrowLog {
    db: sqlite.Database;
    initialized: boolean;
    path: string;
    
    constructor(path: string) {
        this.path = path;
        this.db = new sqlite3.Database(this.path);
    }
    
    async init(): Promise<boolean> {
        const db: sqlite.Database = this.db;
        return new Promise((resolve) => {
            db.get("SELECT id, created_at, meter, temperature, relative_humidity FROM growlogs", (err: string) => {
		console.log('ERROR', err);
                if (err) {
                    db.serialize(() => {
                        db.run("CREATE TABLE growlogs (id INTEGER PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, meter VARCHAR(255) NOT NULL, temperature NUMERIC NOT NULL, relative_humidity NUMERIC NOT NULL)");
                    });
                }
                resolve(true);
            });
        });
    }

    async track(meter: string, temp: number, humidity: number): Promise<boolean> {
        await this.init();

        const db = this.db;

        return new Promise((resolve) => {
            db.serialize(function() {
                const stmt = db.prepare("INSERT INTO growlogs (meter, temperature, relative_humidity) VALUES (?, ?, ?)");
                stmt.run(meter, temp, humidity);
                resolve(true);
            });

        });
    }

    async log(pageno: number, pagesize: number): Promise<[unknown, unknown]> {
        await this.init();

        let sql = "SELECT id, created_at, meter, temperature, relative_humidity FROM growlogs ORDER BY id DESC";
        if (pageno !== 0) {
            sql += " LIMIT " + ((pageno-1)*pagesize) + ", " + pagesize;
        }

        const sqlcount = "SELECT count(*) as count FROM growlogs";

        const db = this.db;

        const p1 =  new Promise(function(resolve, reject) {
            db.all(sql, function(err: Error, rows: LogEntry[]) {
                if (err) {
                    reject(err);
                } else {
                    const data: Array<LogEntry> = [];
                    rows.forEach((row: LogEntry) => {
                        data.push(row);
                    });
                    resolve(data);
                }
            });
        });

        const p2 = new Promise(function(resolve, reject) {
            db.each(sqlcount, (err: string, row: Record<string, unknown>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        })

        return Promise.all([p1,p2]);
    }
}
