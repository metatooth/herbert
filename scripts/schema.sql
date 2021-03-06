begin;

create table manufacturers (
  manufacturer varchar(255) primary key,
  username varchar(255),
  passworddigest varchar(255),
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

create table device_types (
  devicetype varchar(255) primary key,
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

create table devices (
  device macaddr primary key,
  devicetype varchar(255) references device_types(devicetype),
  manufacturer varchar(255) references manufacturers(manufacturer),
  nickname varchar(255),
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

create table readings (
  id serial primary key,
  meter macaddr references devices(device),
  temperature numeric not null,
  humidity numeric not null,
  pressure numeric not null,
  createdat timestamp default current_timestamp
);

create table statuses (
  id serial primary key,
  device macaddr references devices(device),
  status numeric not null,
  createdat timestamp default current_timestamp
);

create table profiles (
  id serial primary key,
  profile varchar(255) unique,
  lampstart time not null,
  lampduration interval hour to minute,
  lampontemperature numeric,
  lamponhumidity numeric,
  lampofftemperature numeric,
  lampoffhumidity numeric,
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

create table workers (
  worker macaddr primary key,
  nickname varchar(255) unique,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp,
  deleted boolean default false,
  deletedAt timestamp
);

create table worker_devices (
  worker macaddr references workers(worker),
  device macaddr references devices(device),
  createdat timestamp default current_timestamp
);

create table zones (
  id serial primary key,
  nickname varchar(255) unique,
  parentid integer references zones(id),
  profileid integer references profiles(id),
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

create table zone_devices (
  zoneid integer references zones(id),
  device macaddr references devices(device),
  createdat timestamp default current_timestamp,
  primary key (zoneid, device)
);

create table meter_types (
  metertype varchar(255) primary key,
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

create table zone_meters (
  zoneid integer references zones(id),
  meter macaddr references devices(device),
  metertype varchar(255) references meter_types(metertype),
  createdat timestamp default current_timestamp,
  primary key (zoneid, meter)
);

insert into manufacturers (manufacturer)
       values ('SwitchBot'), ('WYZE'), ('mockbot');

insert into device_types (devicetype)
       values ('meter'), ('lamp'), ('blower'),
       ('humidifier'), ('dehumidifier'), ('heater');

insert into profiles (profile, lampstart, lampduration, lampontemperature,
       lamponhumidity, lampofftemperature, lampoffhumidity)
       values
       ('Officespace', '13:00', '10 hours', 18.3, 21, 12.8, 21),
       ('Torello Clone', '5:00', '24 hours', 22.8, 68, 22.8, 68),
       ('Torello Veg', '13:00', '18 hours', 25.3, 55, 23.1, 55),
       ('Torello Flower 1', '13:00', '12 hours', 24.7, 55, 21.1, 43),
       ('Torello Flower 2', '13:00', '12 hours', 22.2, 43, 19.7, 43),
       ('Torello Flower 3', '13:00', '12 hours', 19.2, 35, 16.4, 35);
       
insert into zones (nickname) VALUES ('root');

commit;
