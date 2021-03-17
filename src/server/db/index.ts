import { Pool, Result } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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
    "SELECT id, profile, lampstart, lampduration, lampontemperature, lamponhumidity, lampofftemperature, lampoffhumidity, updatedat FROM profiles WHERE id = $1",
    [id]
  );
  return rows[0];
}

export async function readZone(id) {
  const res = await query(
    "SELECT z.id, z.nickname, b.id as parentid, b.nickname as parent, p.id as profileid, p.profile, z.updatedat FROM zones z LEFT JOIN zones b ON z.parentid = b.id LEFT JOIN profiles p ON z.profileid = p.id WHERE z.id = $1",
    [id]
  );
  const children = await query("SELECT * FROM zones WHERE parentid = $1", [id]);
  const devices = await query(
    "SELECT d.* FROM devices d INNER JOIN zone_devices zd ON d.device = zd.device WHERE zd.zoneid = $1",
    [id]
  );

  const zone = await res.rows[0];

  const profile = await query("SELECT * FROM profiles WHERE id = $1", [
    zone.profileid
  ]);

  if (profile) {
    zone.profile = profile.rows[0];
  }

  if (devices) {
    zone.devices = await devices.rows;
  }

  if (children) {
    zone.children = await children.rows;
  }

  return zone;
}

export async function readZones() {
  const zones = [];

  const { rows } = await query(
    "SELECT id FROM zones WHERE deleted <> true",
    []
  );

  rows.forEach(row => {
    const z = readZone(row.id);
    zones.push(z);
  });

  return Promise.all(zones);
}

export async function readZoneDevices(device: string) {
  const zones = [];

  const {
    rows
  } = await query("SELECT zoneid as id FROM zone_devices WHERE device = $1", [
    device
  ]);

  rows.forEach(row => {
    const z = readZone(row.id);
    zones.push(z);
  });

  console.log("ZONES", zones);

  return Promise.all(zones);
}

export async function readDevice(id) {
  const { rows } = await query("SELECT * FROM devices WHERE device = $1", [id]);
  return rows[0];
}

export async function readWorker(id) {
  const { rows } = await query("SELECT * FROM workers WHERE worker = $1", [id]);
  return rows[0];
}

export async function reading(device: string) {
  const {
    rows
  } = await query(
    "SELECT * FROM readings WHERE meter = $1 ORDER BY id DESC LIMIT 1",
    [device]
  );
  return rows[0];
}
export async function registerDevice(macaddr, manufacturer, type) {
  query("SELECT * FROM devices WHERE device = $1", [macaddr]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", macaddr);
      query(
        "INSERT INTO devices (device, manufacturer, deviceType) VALUES ($1, $2, $3)",
        [macaddr, manufacturer, type]
      );
    }
  });
}

export async function workerStatus(macaddr, inet) {
  query("SELECT * FROM workers WHERE worker = $1", [macaddr]).then(res => {
    if (res.rowCount === 0) {
      console.log("inserting", macaddr);
      query("INSERT INTO workers (worker, inet) VALUES ($1, $2)", [
        macaddr,
        inet
      ]);
    } else if (res.rowCount === 1) {
      console.log("updating", macaddr);
      query(
        "UPDATE workers SET inet = $1, updatedat = CURRENT_TIMESTAMP WHERE worker = $2",
        [inet, macaddr]
      );
    } else {
      // error
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

export async function createStatus(device, status) {
  query("SELECT * FROM devices WHERE device = $1", [device]).then(res => {
    if (res.rowCount !== 0) {
      query("INSERT INTO statuses (device, status) VALUES ($1, $2)", [
        device,
        status
      ]);
    }
  });
}
