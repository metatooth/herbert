begin;

create table edges (
  a integer references zones(id),
  b integer references zones(id),
  createdat timestamp default current_timestamp,
  primary key (a, b)
);

alter table zones add column zone macaddr unique;

commit;
