import { Pool, Result } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 30,
  ssl: { rejectUnauthorized: false }
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

export async function readDevice(id) {
  const res = await query("SELECT * FROM devices WHERE device = $1", [id]);

  const device = await res.rows[0];

  if (device.devicetype === "meter") {
    const {
      rows
    } = await query(
      "SELECT device, devicetype, manufacturer, nickname, temperature, humidity, pressure, updatedat as timestamp, createdat, updatedat, deleted, deletedat FROM devices WHERE device = $1",
      [id]
    );
    return rows[0];
  } else {
    const {
      rows
    } = await query(
      "SELECT device, devicetype, manufacturer, nickname, status, updatedat as timestamp, createdat, updatedat, deleted, deletedat FROM devices WHERE device = $1",
      [id]
    );
    return rows[0];
  }
}

export async function readZone(id) {
  const promises = [];

  const res = await query(
    "SELECT z.id, z.nickname, p.id as profileid, z.updatedat, z.active FROM zones z LEFT JOIN profiles p ON z.profileid = p.id WHERE z.id = $1",
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
    "SELECT id FROM zones WHERE deleted <> true ORDER BY nickname",
    []
  );

  rows.forEach(row => {
    const z = readZone(row.id);
    zones.push(z);
  });

  return Promise.all(zones);
}

export async function readActiveZones() {
  const zones = [];

  const { rows } = await query(
    "SELECT id FROM zones WHERE deleted <> true AND active <> false ORDER BY nickname",
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
  } = await query(
    "SELECT d.id FROM devices d INNER JOIN zone_devices zd ON d.device = zd.device WHERE d.device = $1 ORDER BY d.devicetype",
    [device]
  );

  rows.forEach(row => {
    const z = readZone(row.id);
    zones.push(z);
  });

  return Promise.all(zones);
}

export async function readDevices() {
  const devices = [];

  const { rows } = await query(
    "SELECT device FROM devices WHERE deleted <> true ORDER BY nickname",
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

export async function registerDevice(macaddr, manufacturer) {
  const { rows } = await query("SELECT * FROM devices WHERE device = $1", [
    macaddr
  ]);

  if (rows.length === 1) {
    return rows[0];
  } else {
    await query("INSERT INTO devices (device, manufacturer) VALUES ($1, $2)", [
      macaddr,
      manufacturer
    ]);
    const { rows } = await query("SELECT * FROM devices WHERE device = $1", [
      macaddr
    ]);
    return rows[0];
  }
}

export async function registerMeter(macaddr, manufacturer) {
  const { rows } = await query("SELECT * FROM devices WHERE device = $1", [
    macaddr
  ]);
  if (rows.length === 1) {
    return rows[0];
  } else {
    await query(
      "INSERT INTO devices (device, devicetype, manufacturer) VALUES ($1, 'meter', $2)",
      [macaddr, manufacturer]
    );
    const { rows } = await query("SELECT * FROM devices WHERE device = $1", [
      macaddr
    ]);
    return rows[0];
  }
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

export async function createReading(
  meter,
  temperature,
  humidity,
  pressure,
  ts
) {
  query("SELECT * FROM devices WHERE device = $1", [meter]).then(res => {
    if (res.rowCount !== 0) {
      query(
        "UPDATE devices SET temperature = $1, humidity = $2, pressure = $3, devicetype = 'meter', deleted = false, updatedat = CURRENT_TIMESTAMP WHERE device = $4",
        [temperature, humidity, pressure, meter]
      );
      query(
        "INSERT INTO readings (meter, temperature, humidity, pressure, observedat) VALUES ($1, $2, $3, $4, $5)",
        [meter, temperature, humidity, pressure, ts]
      );
    }
  });
}

export async function createStatus(device, status, ts) {
  query("SELECT * FROM devices WHERE device = $1", [device]).then(res => {
    if (res.rowCount !== 0) {
      query(
        "UPDATE devices SET status = $1, deleted = false, updatedat = CURRENT_TIMESTAMP WHERE device = $2",
        [status, device]
      );
      query(
        "INSERT INTO statuses (device, status, observedat) VALUES ($1, $2, $3)",
        [device, status, ts]
      );
    }
  });
}
