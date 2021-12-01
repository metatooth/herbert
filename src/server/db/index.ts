import { Pool, QueryResult } from "pg";
import {
  Account,
  Device,
  Meter,
  Profile,
  Zone,
  Worker,
  Config
} from "../../shared/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 30,
  ssl: { rejectUnauthorized: false }
});

export async function query<T>(text, params): Promise<QueryResult<T>> {
  //const start = Date.now();
  const res = await pool.query<T>(text, params);
  //const duration = Date.now() - start;
  //console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
}

export async function readAccount(id: number): Promise<Account> {
  const { rows } = await query<Account>(
    "SELECT title, logo, locale, timezone, units, refresh, timeout, interval, openweather, cityname, statecode, reportingperiod, updatedat FROM accounts WHERE id = $1",
    [id]
  );
  return rows[0];
}

export async function readProfile(id: string): Promise<Profile> {
  const { rows } = await query<Profile>(
    "SELECT id, profile, lampstart, lampduration, lampontemperature, lamponhumidity, lampofftemperature, lampoffhumidity, bloweractive, blowercycle, irrigationperday, irrigationduration, controltype, updatedat FROM profiles WHERE id = $1",
    [id]
  );
  return rows[0];
}

export async function readDevice(id: string): Promise<Device> {
  const { rows } = await query<Device>(
    "SELECT device, devicetype, manufacturer, nickname, status, updatedat as timestamp, createdat, updatedat, deleted, deletedat FROM devices WHERE device = $1",
    [id]
  );
  return rows[0];
}

export async function readMeter(id: string): Promise<Meter> {
  const { rows } = await query<Meter>(
    "SELECT device, devicetype, manufacturer, nickname, temperature, humidity, pressure, updatedat as timestamp, createdat, updatedat, deleted, deletedat FROM devices WHERE device = $1",
    [id]
  );
  return rows[0];
}

export async function readZone(id: number) {
  const promises = [];

  const res = await query<Zone & Profile>(
    "SELECT z.id, z.nickname, p.id as profileid, z.maxirrigators, z.lamponleafdiff, z.lampoffleafdiff, z.updatedat, z.active FROM zones z LEFT JOIN profiles p ON z.profileid = p.id WHERE z.id = $1",
    [id]
  );

  promises.push(res.rows[0]);

  const profile = await query<Profile>("SELECT * FROM profiles WHERE id = $1", [
    promises[0].profileid
  ]);

  if (profile) {
    promises[0].profile = profile.rows[0];
  }

  const devices = await query<Device>(
    "SELECT d.device FROM devices d INNER JOIN zone_devices zd ON d.device = zd.device WHERE d.devicetype != 'meter' AND zd.zoneid = $1",
    [id]
  );

  if (devices.rowCount > 0) {
    devices.rows.forEach(row => {
      promises.push(readDevice(row.device));
    });
  }

  const meters = await query<Meter>(
    "SELECT d.device FROM devices d INNER JOIN zone_devices zd ON d.device = zd.device WHERE d.devicetype = 'meter' AND zd.zoneid = $1",
    [id]
  );

  if (meters.rowCount > 0) {
    meters.rows.forEach(row => {
      promises.push(readMeter(row.device));
    });
  }

  const children = await query<number>(
    "SELECT e.b FROM zones z INNER JOIN edges e ON z.id = e.a WHERE z.id = $1",
    [id]
  );

  if (children.rowCount > 0) {
    children.rows.forEach(row => {
      promises.push(row);
    });
  }

  return await Promise.all(promises).then(values => {
    values[0].devices = [];
    values[0].meters = [];
    values[0].children = [];

    values.forEach(value => {
      if (value.device) {
        if (value.devicetype == "meter") {
          values[0].meters.push(value);
        } else {
          values[0].devices.push(value);
        }
      } else if (!value.profileid) {
        values[0].children.push(value.b);
      }
    });

    return values[0];
  });
}

export async function parentZone(id: string): Promise<Zone> {
  const { rows } = await query<Zone>(
    "SELECT e.a as id FROM zones z INNER JOIN edges e ON z.id = e.b WHERE e.b = $1",
    [id]
  );
  if (rows.length > 0) {
    return await readZone(rows[0].id);
  } else {
    return null;
  }
}

export async function readZones() {
  const zones = [];

  const { rows } = await query<Zone>(
    "SELECT id FROM zones WHERE deleted <> true",
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

  const { rows } = await query<Zone>(
    "SELECT id FROM zones WHERE deleted <> true AND active <> false",
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

  const { rows } = await query<Device & Zone>(
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

  const { rows } = await query<Device>(
    "SELECT device FROM devices WHERE (devicetype is null OR devicetype != 'meter') AND deleted <> true",
    []
  );

  rows.forEach(row => {
    const d = readDevice(row.device);
    devices.push(d);
  });

  return Promise.all(devices);
}

export async function readMeters() {
  const meters = [];

  const { rows } = await query<Device>(
    "SELECT device FROM devices WHERE devicetype = 'meter' AND deleted <> true",
    []
  );

  rows.forEach(row => {
    const d = readMeter(row.device);
    meters.push(d);
  });

  return Promise.all(meters);
}

export async function readConfig(name: string) {
  const { rows } = await query<Config>(
    "SELECT * FROM worker_config WHERE nickname = $1",
    [name]
  );
  return rows[0];
}

export async function readWorker(macaddr: string) {
  const { rows } = await query("SELECT * FROM workers WHERE worker = $1", [
    macaddr
  ]);
  return rows[0] as Worker;
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

export async function readWorkers() {
  const workers: Worker[] = [];

  const { rows } = await query<Worker>(
    "SELECT worker FROM workers WHERE deleted <> true",
    []
  );

  rows.forEach(async row => {
    const w = await readWorker(row.worker);
    workers.push(w);
  });

  return workers;
}

export async function registerDevice(macaddr: string, manufacturer: string) {
  return query("SELECT * FROM devices WHERE device = $1", [macaddr]).then(
    res => {
      if (res.rowCount === 0) {
        return query(
          "INSERT INTO devices (device, manufacturer) VALUES ($1, $2)",
          [macaddr, manufacturer]
        );
      }
    }
  );
}

export async function registerMeter(macaddr: string, manufacturer: string) {
  return query("SELECT * FROM devices WHERE device = $1", [macaddr]).then(
    res => {
      if (res.rowCount === 0) {
        return query(
          "INSERT INTO devices (device, devicetype, manufacturer) VALUES ($1, 'meter', $2)",
          [macaddr, manufacturer]
        );
      }
    }
  );
}

export async function registerWorker(macaddr: string, inet: string) {
  return query("SELECT * FROM workers WHERE worker = $1", [macaddr]).then(
    async res => {
      if (res.rowCount === 0) {
        const defaultConfig = "default";
        const config = await readConfig(defaultConfig);
        const jsonStr = JSON.stringify(config.config);
        return query(
          "INSERT INTO workers (worker, inet, configname, config) VALUES ($1, $2, $3, $4)",
          [macaddr, inet, defaultConfig, jsonStr]
        );
      } else {
        return query(
          "UPDATE workers SET inet = $1, updatedat = CURRENT_TIMESTAMP WHERE worker = $2",
          [inet, macaddr]
        );
      }
    }
  );
}

export async function updateWorker(id: string) {
  return query("SELECT * FROM workers WHERE worker = $1", [id]).then(res => {
    if (res.rowCount !== 0) {
      return query(
        "UPDATE workers SET updatedat = CURRENT_TIMESTAMP, deleted = false WHERE worker = $1",
        [id]
      );
    }
  });
}

export async function createReading(
  meter: string,
  temperature: number,
  humidity: number,
  pressure: number,
  ts: Date
) {
  return query("SELECT * FROM devices WHERE device = $1", [meter]).then(
    async res => {
      if (res.rowCount !== 0) {
        await query(
          "UPDATE devices SET temperature = $1, humidity = $2, pressure = $3, devicetype = 'meter', deleted = false, updatedat = CURRENT_TIMESTAMP WHERE device = $4",
          [temperature, humidity, pressure, meter]
        );
        return query(
          "INSERT INTO readings (meter, temperature, humidity, pressure, observedat) VALUES ($1, $2, $3, $4, $5)",
          [meter, temperature, humidity, pressure, ts]
        );
      }
    }
  );
}

export async function createStatus(device: string, status: string, ts: Date) {
  return query("SELECT * FROM devices WHERE device = $1", [device]).then(
    async res => {
      if (res.rowCount !== 0) {
        await query(
          "UPDATE devices SET status = $1, deleted = false, updatedat = CURRENT_TIMESTAMP WHERE device = $2",
          [status, device]
        );
        return query(
          "INSERT INTO statuses (device, status, observedat) VALUES ($1, $2, $3)",
          [device, status, ts]
        );
      }
    }
  );
}
