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

create table meter_facts (
  id serial primary key,
  meter macaddr references devices(device),
  dateid integer references date_dim(id),
  timeid integer references time_dim(id),
  reading numeric not null,
  units varchar(32) not null,
  unique(meter, dateid, timeid)
);

commit;

