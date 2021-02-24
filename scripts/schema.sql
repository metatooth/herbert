begin;

create table manufacturers (
  manufacturer varchar(255) primary key,
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
  device varchar(255) primary key,
  manufacturer varchar(255) references manufacturers(manufacturer),
  device_type varchar(255) references device_types(device_type),
  inet inet,
  macaddr macaddr,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

create table readings (
  id serial primary key,
  meter varchar(255) references devices(device),
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

create table clients (
  client varchar(255) primary key,
  nickname varchar(255) unique,
  main varchar(255) references devices(device),
  intake varchar(255) references devices(device),
  profile_id integer references profiles(id),
  inet inet,
  macaddr macaddr,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  deleted boolean default false,
  deleted_at timestamp
);

insert into manufacturers (manufacturer) values ('SwitchBot'), ('WYZE');

insert into device_types (device_type)
       values ('main'), ('intake'),
       ('lamp'), ('blower'), ('humidifier'), ('dehumidifier'), ('heater');

insert into profiles (profile, lamp_start, lamp_duration, lamp_on_temperature,
       lamp_on_humidity, lamp_off_temperature, lamp_off_humidity)
       values
       ('Torello Clone', '00:00', '24 hours', 22.8, 68, 22.8, 68),
       ('Torello Veg', '13:00', '18 hours', 25.3, 55, 23.1, 55),
       ('Torello Flower 1', '13:00', '12 hours', 24.7, 55, 21.1, 43),
       ('Torello Flower 2', '13:00', '12 hours', 22.2, 43, 19.7, 43),
       ('Torello Flower 3', '13:00', '12 hours', 19.2, 35, 16.4, 35);
       
commit;
