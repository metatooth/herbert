begin;

alter table accounts add column reportingperiod numeric not null default 60000;

commit;
