begin;

alter table accounts add column interval integer not null default 30000;

commit;
