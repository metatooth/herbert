begin;

create table date_dim (
  id serial primary key,
  year numeric not null,
  month numeric not null,
  date numeric not null,
  unique(year, month, date)
);

create table time_dim (
  id serial primary key,
  hour numeric not null,
  minute numeric not null,
  unique(hour, minute)
);

create table unit_types (
  units varchar(32) primary key,
  createdat timestamp default current_timestamp
);

insert into unit_types (units) values ('CELSIUS'), ('%RH');

create table meter_facts (
  id serial primary key,
  meter macaddr references devices(device),
  dateid integer references date_dim(id),
  timeid integer references time_dim(id),
  reading numeric not null,
  units varchar(32) references unit_types(units),
  unique(meter, units, dateid, timeid)
);

commit;

