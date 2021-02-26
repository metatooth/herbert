begin;

create table manufacturers (
  manufacturer varchar(255) primary key,
  username varchar(255),
  password_digest varchar(255),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table device_types (
  device_type varchar(255) primary key,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table devices (
  device macaddr primary key,
  device_type varchar(255) references device_types(device_type),
  manufacturer varchar(255) references manufacturers(manufacturer),
  nickname varchar(255),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table readings (
  id serial primary key,
  meter macaddr references devices(device),
  temperature numeric not null,
  humidity numeric not null,
  pressure numeric not null,
  created_at timestamp default current_timestamp
);

create table profiles (
  id serial primary key,
  profile varchar(255) unique,
  lamp_start time not null,
  lamp_duration interval hour to minute,
  lamp_on_temperature numeric,
  lamp_on_humidity numeric,
  lamp_off_temperature numeric,
  lamp_off_humidity numeric,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table workers (
  worker macaddr primary key,
  nickname varchar(255) unique,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table worker_devices (
  worker macaddr references workers(worker),
  device macaddr references devices(device),
  created_at timestamp default current_timestamp
);

create table zones (
  id serial primary key,
  nickname varchar(255) unique,
  parent_id integer references zones(id),
  profile_id integer references profiles(id),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table zone_devices (
  zone_id integer references zones(id),
  device macaddr references devices(device),
  created_at timestamp default current_timestamp
);

create table meter_types (
  meter_type varchar(255) primary key,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table zone_meters (
  zone_id integer references zones(id),
  meter macaddr references devices(device),
  meter_type varchar(255) references meter_types(meter_type),
  created_at timestamp default current_timestamp
);

insert into manufacturers (manufacturer)
       values ('SwitchBot'), ('WYZE'), ('mockbot');

insert into device_types (device_type)
       values ('meter'), ('lamp'), ('blower'),
       ('humidifier'), ('dehumidifier'), ('heater');

insert into profiles (profile, lamp_start, lamp_duration, lamp_on_temperature,
       lamp_on_humidity, lamp_off_temperature, lamp_off_humidity)
       values
       ('Officespace', '13:00', '10 hours', 18.35, 21, 12.85, 21),
       ('Torello Clone', '00:00', '24 hours', 22.8, 68, 22.8, 68),
       ('Torello Veg', '13:00', '18 hours', 25.3, 55, 23.1, 55),
       ('Torello Flower 1', '13:00', '12 hours', 24.7, 55, 21.1, 43),
       ('Torello Flower 2', '13:00', '12 hours', 22.2, 43, 19.7, 43),
       ('Torello Flower 3', '13:00', '12 hours', 19.2, 35, 16.4, 35);
       
insert into zones (nickname) VALUES ('root');

commit;
