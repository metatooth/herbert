begin;

alter table accounts add column logo bytea;
alter table accounts add column title text;
alter table accounts add column refresh integer not null default 30000;
alter table accounts add column timeout integer not null default 300000;

commit;
