begin;

create table status_facts (
  id serial primary key,
  device macaddr references devices(device),
  dateid integer references date_dim(id),
  timeid integer references time_dim(id),
  status varchar(80) not null,
  unique(device, dateid, timeid)
);

commit;

