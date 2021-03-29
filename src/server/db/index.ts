import { Pool, Result } from "pg";

let ssl = null;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 30,
  ssl:ssl
});

export async function query(text, params): Promise<Result> {
  //const start = Date.now();
  const res = await pool.query(text, params);
  //const duration = Date.now() - start;
  //console.log("executed query", { text, duration, rows: res.rowCount });
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

export async function readDevice(id) {
  const res = await query("SELECT * FROM devices WHERE device = $1", [id]);

  const device = await res.rows[0];

  if (device.devicetype === "meter") {
    const {
      rows
    } = await query(
      "SELECT d.*, r.temperature, r.humidity, r.pressure, r.createdat as timestamp FROM devices d INNER JOIN readings r ON d.device = r.meter WHERE d.device = $1 ORDER BY r.id DESC LIMIT 1",
      [id]
    );
    return rows[0];
  } else {
    const {
      rows
    } = await query(
      "SELECT d.*, s.status, s.createdat as timestamp FROM devices d INNER JOIN statuses s ON d.device = s.device WHERE d.device = $1 ORDER BY s.id DESC LIMIT 1",
      [id]
    );
    return rows[0];
  }
}

export async function readZone(id) {
  const promises = [];

  const res = await query(
    "SELECT z.id, z.nickname, p.id as profileid, z.updatedat FROM zones z LEFT JOIN profiles p ON z.profileid = p.id WHERE z.id = $1",
    [id]
  );

  promises.push(res.rows[0]);

  const profile = await query("SELECT * FROM profiles WHERE id = $1", [
    promises[0].profileid
  ]);

  if (profile) {
    promises[0].profile = profile.rows[0];
  }

  const devices = await query(
    "SELECT d.device FROM devices d INNER JOIN zone_devices zd ON d.device = zd.device WHERE zd.zoneid = $1",
    [id]
  );

  if (devices.rowCount > 0) {
    devices.rows.forEach(row => {
      promises.push(readDevice(row.device));
    });
  }

  return await Promise.all(promises).then(values => {
    values[0].devices = [];
    values.forEach(value => {
      if (value.device) {
        values[0].devices.push(value);
      }
    });

    return values[0];
  });
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

  return Promise.all(zones);
}

export async function readDevices() {
  const devices = [];

  const { rows } = await query(
    "SELECT device FROM devices WHERE deleted <> true",
    []
  );

  rows.forEach(row => {
    const d = readDevice(row.device);
    devices.push(d);
  });

  return Promise.all(devices);
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
      query("INSERT INTO workers (worker, inet) VALUES ($1, $2)", [
        macaddr,
        inet
      ]);
    } else if (res.rowCount === 1) {
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
      query("UPDATE devices SET deleted = false WHERE device = $1", [meter]);
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
      query("UPDATE devices SET deleted = false WHERE device = $1", [device]);
      query("INSERT INTO statuses (device, status) VALUES ($1, $2)", [
        device,
        status
      ]);
    }
  });
}
