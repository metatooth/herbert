const sqlite3 = require('sqlite3').verbose();

export class GrowLog {
    db: any;
    initialized: boolean;
    path: string;
    
    constructor(path: string) {
	this.path = path;
	this.db = new sqlite3.Database(this.path);
    }
    
    async init(): Promise<boolean> {
	const scope = this;
	return new Promise(function(resolve, reject) {
	    scope.db.get("SELECT id, created_at, temperature, relative_humidity FROM growlogs", function(err: any, row: any) {
		if (err) {
		    scope.db.serialize(function() {
			scope.db.run("CREATE TABLE growlogs (id INTEGER PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, temperature NUMERIC NOT NULL, relative_humidity NUMERIC NOT NULL)");
		    });
		}
		resolve(true);
	});
    }

    async track(temp: number, humidity: number): Promise<boolean> {
	await this.init();

        return new Promise((resolve, reject) {
            const db = this.db;
	    db.serialize(function() {
		const stmt = db.prepare("INSERT INTO growlogs (temperature, relative_humidity) VALUES (?, ?)");
		stmt.run(temp, humidity);
		resolve(true);
	    });

	});
    }

    async log(pageno: number, pagesize: number): Promise<[unknown, unknown]> {
	await this.init();

	let sql = "SELECT id, created_at, temperature, relative_humidity FROM growlogs ORDER BY id DESC";
	if (pageno !== 0) {
	    sql += " LIMIT " + ((pageno-1)*pagesize) + ", " + pagesize;
	}
	
	const sqlcount = "SELECT count(*) as count FROM growlogs";

	const p1 =  new Promise(function(resolve, reject) {
	    const db = this.db;
            db.all(sql, function(err: any, rows: any) {
                if (err) {
                    reject(err);
                } else {
                    const data: Array<object> = [];
                    rows.forEach(function (row: any) {
                        data.push({id: row.id,
				   created_at: row.created_at,
				   temperature: row.temperature,
				   relative_humidity: row.relative_humidity});
                    });
                    resolve(data);
                }
            });
        });

        const p2 = new Promise(function(resolve, reject) {
	    const db = this.db;
            db.each(sqlcount, function(err: any, row: any) {
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
